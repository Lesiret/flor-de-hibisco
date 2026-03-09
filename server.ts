import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import { MercadoPagoConfig, Preference } from "mercadopago";

const rootDir = process.cwd();

// Carrega variáveis de ambiente
dotenv.config({ path: path.join(rootDir, ".env") });
dotenv.config({ path: path.join(rootDir, ".env.local"), override: true });

// Pacote padrão para envio (Dimensões que evitam taxas extras dos Correios)
const DEFAULT_PACKAGE = {
  weight: 0.5,
  height: 7,
  width: 15,
  length: 23
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  console.log("----- ENVIRONMENT -----");
  console.log("Mercado Pago:", process.env.MERCADO_PAGO_ACCESS_TOKEN ? "OK" : "MISSING");
  console.log("Melhor Envio:", process.env.MELHOR_ENVIO_TOKEN ? "OK" : "MISSING");
  console.log("-----------------------");

  const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || ""
  });

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      mercadoPago: !!process.env.MERCADO_PAGO_ACCESS_TOKEN,
      melhorEnvio: !!process.env.MELHOR_ENVIO_TOKEN
    });
  });

  app.post("/api/checkout", async (req, res) => {
    try {
      const { items, shippingCost } = req.body;
      const preference = new Preference(mpClient);
      const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;

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

      res.json({ id: response.id, init_point: response.init_point });
    } catch (error: any) {
      console.error("Erro Mercado Pago:", error);
      res.status(500).json({ error: "Erro ao criar pagamento", details: error.message });
    }
  });

  // 🚚 CALCULAR FRETE (MELHOR ENVIO)
  app.post("/api/shipping", async (req, res) => {
    try {
      const meToken = process.env.MELHOR_ENVIO_TOKEN;
      
      const { from, to, value } = req.body;
      const cleanFrom = from.replace(/\D/g, "");
      const cleanTo = to.replace(/\D/g, "");

      if (cleanFrom.length !== 8 || cleanTo.length !== 8)
        return res.status(400).json({ error: "CEP inválido" });

      if (!meToken) {
        return res.status(500).json({ error: "Token Melhor Envio não configurado" });
      }

      console.log("CALCULANDO VIA MELHOR ENVIO...");
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
        options: {
          receipt: false,
          own_hand: false
        }
      };

      const response = await axios.post(
        "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
        payload,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${meToken.replace(/["']/g, '').trim()}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Aplicação de E-commerce'
          },
          timeout: 10000
        }
      );

      const result = response.data
        .filter((service: any) => !service.error && service.price)
        .map((service: any) => ({
          id: String(service.id),
          company: { name: service.company?.name || "Transportadora" },
          name: service.name,
          price: Number(service.price),
          delivery_time: service.delivery_time
        }));

      console.log("MELHOR ENVIO RESPONSE:", result.length, "serviços");
      res.json(result);
    } catch (error: any) {
      console.error("Erro no cálculo de frete:", error.response?.data || error.message);
      res.status(500).json({
        error: "Erro ao calcular frete",
        details: error.response?.data || error.message
      });
    }
  });

  app.post("/api/webhooks/mercadopago", async (req, res) => {
    try {
      const { action, data } = req.body;
      if (action === "payment.created" || action === "payment.updated") {
        console.log("Pagamento notificado:", data.id);
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Erro webhook:", error);
      res.sendStatus(500);
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });
}

startServer();
