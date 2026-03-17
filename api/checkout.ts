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

    // 🔒 0. Validação básica
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado" });
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Carrinho vazio" });

    // 🔒 1. Buscar produtos reais no banco
    const productIds = items.map((i: any) => i.id);
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("id, name, price")
      .in("id", productIds);

    if (prodError) throw new Error(`Erro ao buscar produtos: ${prodError.message}`);
    if (!products || products.length === 0) throw new Error("Nenhum produto encontrado no banco");

    const productMap: any = {};
    products.forEach((p: any) => (productMap[p.id] = p));

    // 🔒 2. Montar itens seguros
    let subtotal = 0;
    const secureItems = items.map((item: any) => {
      const product = productMap[item.id];
      if (!product) throw new Error(`Produto inválido: ${item.id}`);

      const quantity = Number(item.quantity);
      if (quantity <= 0 || quantity > 10) throw new Error("Quantidade inválida");

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

    if (subtotal <= 0) throw new Error("Subtotal inválido");

    // 🔒 3. Validar cupom PRIMEIRACOMPRA
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
          return res.status(400).json({ error: "Cupom válido apenas para primeira compra" });
        }

        discount = subtotal * 0.1;
        couponApplied = "PRIMEIRACOMPRA";
      }
    }

    if (discount > subtotal) throw new Error("Desconto inválido");

    // 🔒 4. Frete
    const safeShippingCost = Math.max(Number(shippingCost) || 0, 0);

    // 🔒 5. Total final
    const total = subtotal - discount + safeShippingCost;
    if (total <= 0) throw new Error("Total inválido");

    const baseUrl = process.env.APP_URL || `https://${req.headers.host}`;

    // 🔥 6. Salvar pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{ user_id: userId, total, status: "pending", payment_method: "mercadopago" }])
      .select()
      .single();

    if (orderError || !order) throw new Error(`Erro ao criar pedido: ${orderError?.message || "pedido não retornou"}`);

    // 🔥 7. Salvar itens do pedido
    const orderItems = secureItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: item.unit_price
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw new Error(`Erro ao salvar itens do pedido: ${itemsError.message}`);

    // 🔒 8. Itens ajustados com desconto
    const adjustedItems = [
      ...secureItems,
      ...(discount > 0
        ? [{ id: "discount", title: `Desconto (${couponApplied})`, quantity: 1, unit_price: -Number(discount), currency_id: "BRL" }]
        : [])
    ];

    // 🔥 9. Criar pagamento Mercado Pago
    const preference = new Preference(mpClient);
    const response = await preference.create({
      body: {
        items: adjustedItems,
        external_reference: order.id,
        shipments: { cost: safeShippingCost, mode: "not_specified" },
        back_urls: {
          success: `${baseUrl}/payment-success`,
          failure: `${baseUrl}/payment-failure`,
          pending: `${baseUrl}/payment-pending`
        },
        auto_return: "approved"
      }
    });

    return res.status(200).json({ id: response.id, init_point: response.init_point });
  } catch (error: any) {
    console.error("Erro Mercado Pago:", error);
    return res.status(500).json({ error: error.message });
  }
}