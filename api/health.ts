export default function handler(req: any, res: any) {

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    services: {
      mercadoPago: !!process.env.MERCADO_PAGO_ACCESS_TOKEN,
      melhorEnvio: !!process.env.MELHOR_ENVIO_TOKEN
    },
    timestamp: new Date().toISOString()
  });

}