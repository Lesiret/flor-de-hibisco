import { MercadoPagoConfig, Preference } from "mercadopago";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, shippingCost } = req.body;

    const preference = new Preference(mpClient);

    const response = await preference.create({
      body: {
        items: items.map((item) => ({
          id: item.id,
          title: item.name,
          quantity: Number(item.quantity),
          unit_price: Number(item.price),
          currency_id: "BRL"
        })),
        shipments: {
          cost: Number(shippingCost || 0),
          mode: "not_specified"
        },
        back_urls: {
          success: `${process.env.APP_URL}/payment-success`,
          failure: `${process.env.APP_URL}/payment-failure`,
          pending: `${process.env.APP_URL}/payment-pending`
        },
        auto_return: "approved"
      }
    });

    res.status(200).json({
      id: response.id,
      init_point: response.init_point
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}