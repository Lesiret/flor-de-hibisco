import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { from, to, items } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: "CEP obrigatório" });
    }

    const cleanFrom = from.replace(/\D/g, "");
    const cleanTo = to.replace(/\D/g, "");

    if (cleanFrom.length !== 8 || cleanTo.length !== 8) {
      return res.status(400).json({ error: "CEP inválido" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Itens inválidos" });
    }

    // 🔒 BUSCAR PRODUTOS REAIS
    const productIds = items.map((item: any) => item.id);

    const { data: products, error } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (error) {
      throw new Error("Erro ao buscar produtos");
    }

    const productMap: any = {};
    products.forEach((p: any) => {
      productMap[p.id] = p;
    });

    // 🔒 CALCULAR VALOR REAL
    let totalValue = 0;

    items.forEach((item: any) => {
      const product = productMap[item.id];

      if (!product) {
        throw new Error(`Produto inválido: ${item.id}`);
      }

      const quantity = Number(item.quantity);

      if (quantity <= 0 || quantity > 10) {
        throw new Error("Quantidade inválida");
      }

      totalValue += Number(product.price) * quantity;
    });

    const token = process.env.MELHOR_ENVIO_TOKEN;

    if (!token) {
      return res.status(500).json({ error: "Token Melhor Envio não configurado" });
    }

    const payload = {
      from: { postal_code: cleanFrom },
      to: { postal_code: cleanTo },
      products: [
        {
          id: "p1",
          width: 16,
          height: 8,
          length: 23,
          weight: 1,
          insurance_value: totalValue, // 🔥 AGORA SEGURO
          quantity: 1
        }
      ],
      services: "2,3",
      options: { receipt: false, own_hand: false }
    };

    const response = await axios.post(
      "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
      payload,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token.replace(/["']/g, "").trim()}`,
          "Content-Type": "application/json",
          "User-Agent": "Flor de Hibisco"
        },
        timeout: 10000
      }
    );

    const data = Array.isArray(response.data) ? response.data : [];

    const SHIPPING_DISCOUNT = 0.4;
    const MIN_SHIPPING_PRICE = 10;

    const result = data
      .filter((service: any) => !service.error && service.price)
      .map((service: any) => {
        const originalPrice = Number(service.price) || 0;
        const discountedPrice = originalPrice * (1 - SHIPPING_DISCOUNT);

        return {
          id: String(service.id),
          company: service.company?.name || "Transportadora",
          name: service.name,
          price: Number(Math.max(discountedPrice, MIN_SHIPPING_PRICE).toFixed(2)),
          delivery_time: service.delivery_time
        };
      });

    if (result.length === 0) {
      return res.status(200).json([
        {
          id: "fallback",
          company: "Entrega padrão",
          name: "PAC",
          price: 19.9,
          delivery_time: 7
        }
      ]);
    }

    return res.status(200).json(result);

  } catch (error: any) {
    console.error("Erro Melhor Envio:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Erro ao calcular frete",
      details: error.response?.data || error.message
    });
  }

}