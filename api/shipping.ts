import axios from "axios";

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { from, to, value } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: "CEP obrigatório" });
    }

    const cleanFrom = from.replace(/\D/g, "");
    const cleanTo = to.replace(/\D/g, "");

    if (cleanFrom.length !== 8 || cleanTo.length !== 8) {
      return res.status(400).json({ error: "CEP inválido" });
    }

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
          width: 15,
          height: 7,
          length: 23,
          weight: 0.5,
          insurance_value: Number(value || 0),
          quantity: 1
        }
      ],
      services: "1,2,3,4,12,17",
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

    // Garantir que response.data seja sempre array
    const data = Array.isArray(response.data) ? response.data : [];
    console.log("Melhor Envio Data:", data);

    const result = data
      .filter((service: any) => !service.error && service.price)
      .map((service: any) => ({
        id: String(service.id),
        company: service.company?.name || "Transportadora",
        name: service.name,
        price: Number(service.price),
        delivery_time: service.delivery_time
      }));

    // Fallback caso nenhuma transportadora retorne
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