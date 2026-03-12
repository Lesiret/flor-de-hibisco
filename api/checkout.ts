import { MercadoPagoConfig, Preference } from "mercadopago";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { items, shippingCost } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Carrinho vazio"
      });
    }

    const baseUrl =
      process.env.APP_URL ||
      `https://${req.headers.host}`;

    const preference = new Preference(mpClient);

    const response = await preference.create({
      body: {
        items: items.map((item: any) => ({
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