import axios from "axios";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { from, to, value } = req.body;

    const cleanFrom = from.replace(/\D/g, "");
    const cleanTo = to.replace(/\D/g, "");

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
      ]
    };

    const response = await axios.post(
      "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
      payload,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
          "Content-Type": "application/json",
          "User-Agent": "Flor de Hibisco"
        }
      }
    );

    const result = response.data
      .filter((service) => !service.error && service.price)
      .map((service) => ({
        id: String(service.id),
        company: service.company?.name || "Transportadora",
        name: service.name,
        price: Number(service.price),
        delivery_time: service.delivery_time
      }));

    res.status(200).json(result);

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "Erro ao calcular frete",
      details: error.response?.data || error.message
    });
  }
}