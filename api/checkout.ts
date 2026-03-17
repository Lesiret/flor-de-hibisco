import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@supabase/supabase-js";

// 🔒 Supabase (backend seguro)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { items, shippingCost, coupon, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Carrinho vazio"
      });
    }

    // 🔒 1. BUSCAR PRODUTOS REAIS NO BANCO
    const productIds = items.map((item: any) => item.id);

    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price")
      .in("id", productIds);

    if (error || !products || products.length === 0) {
      throw new Error("Erro ao buscar produtos");
    }

    const productMap: any = {};
    products.forEach((p: any) => {
      productMap[p.id] = p;
    });

    // 🔒 2. MONTAR ITENS SEGUROS
    let subtotal = 0;

    const secureItems = items.map((item: any) => {
      const product = productMap[item.id];

      if (!product) {
        throw new Error(`Produto inválido: ${item.id}`);
      }

      const quantity = Number(item.quantity);

      if (quantity <= 0 || quantity > 10) {
        throw new Error("Quantidade inválida");
      }

      const price = Number(product.price);

      subtotal += price * quantity;

      return {
        id: product.id,
        title: product.name,
        quantity,
        unit_price: price,
        currency_id: "BRL"
      };
    });

    if (subtotal <= 0) {
      return res.status(400).json({ error: "Subtotal inválido" });
    }

    // 🔒 3. VALIDAR CUPOM (PRIMEIRA COMPRA)
    let discount = 0;
    let couponApplied = null;

    if (coupon && typeof coupon === "string") {
      const normalizedCoupon = coupon.toUpperCase();

      if (normalizedCoupon === "PRIMEIRACOMPRA") {

        const { data: existingOrders } = await supabase
          .from("orders")
          .select("id")
          .eq("user_id", userId)
          .limit(1);

        if (existingOrders && existingOrders.length > 0) {
          throw new Error("Cupom válido apenas para primeira compra");
        }

        discount = subtotal * 0.1;
        couponApplied = "PRIMEIRACOMPRA";
      }
    }

    // 🔒 VALIDAÇÃO EXTRA
    if (discount > subtotal) {
      throw new Error("Desconto inválido");
    }

    // 🔒 4. FRETE
    const safeShippingCost = Math.max(Number(shippingCost) || 0, 0);

    // 🔒 5. TOTAL FINAL
    const total = subtotal - discount + safeShippingCost;

    if (total <= 0) {
      return res.status(400).json({
        error: "Total inválido"
      });
    }

    const baseUrl =
      process.env.APP_URL ||
      `https://${req.headers.host}`;

    // 🔥 6. SALVAR PEDIDO (ANTES DO PAGAMENTO)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total: total,
          status: "pending",
          payment_method: "mercadopago"
        }
      ])
      .select()
      .single();

    if (orderError || !order) {
      throw new Error("Erro ao criar pedido");
    }

    // 🔥 SALVAR ITENS DO PEDIDO
    const orderItems = secureItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: item.unit_price
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      throw new Error("Erro ao salvar itens do pedido");
    }

    const preference = new Preference(mpClient);

    // 🔒 7. ITENS AJUSTADOS (com desconto)
    const adjustedItems = [
      ...secureItems,
      ...(discount > 0
        ? [{
            id: "discount",
            title: `Desconto (${couponApplied})`,
            quantity: 1,
            unit_price: -Number(discount),
            currency_id: "BRL"
          }]
        : [])
    ];

    // 🔥 8. CRIAR PAGAMENTO
    const response = await preference.create({
      body: {
        items: adjustedItems,

        external_reference: order.id, // 🔥 LIGA COM WEBHOOK

        shipments: {
          cost: safeShippingCost,
          mode: "not_specified"
        },

        back_urls: {
          success: `${baseUrl}/payment-success`,
          failure: `${baseUrl}/payment-failure`,
          pending: `${baseUrl}/payment-pending`
        },

        auto_return: "approved"
      }
    });

    return res.status(200).json({
      id: response.id,
      init_point: response.init_point
    });

  } catch (error: any) {

    console.error("Erro Mercado Pago:", error);

    return res.status(500).json({
      error: "Erro ao criar pagamento",
      details: error.message
    });

  }

}