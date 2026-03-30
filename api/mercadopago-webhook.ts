import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const body = req.body;

    if (body.type !== "payment") {
      return res.status(200).send("ignored");
    }

    const paymentId = body.data?.id;

    if (!paymentId) {
      return res.status(400).json({ error: "Sem paymentId" });
    }

    // 🔥 BUSCAR PAGAMENTO REAL NO MERCADO PAGO
    const mpResponse = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
        }
      }
    );

    const payment = mpResponse.data;

    const orderId = payment.external_reference;
    const status = payment.status;

    if (!orderId) {
      return res.status(400).json({ error: "Sem external_reference" });
    }

    let newStatus = "Pagamento em análise";

    if (status === "approved") newStatus = "Pagamento aprovado";
    else if (status === "pending") newStatus = "Pagamento em análise";
    else if (status === "in_process") newStatus = "Pagamento em análise";
    else if (status === "rejected") newStatus = "Cancelado";
    else if (status === "cancelled") newStatus = "Cancelado";

    const { error } = await supabase
      .from("orders")
      .update({ 
          status: newStatus,
          payment_id: paymentId 
        })
      .eq("id", orderId);

    if (error) {
      console.error("Erro ao atualizar pedido:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });

  } catch (err: any) {
    console.error("Erro no webhook:", err.response?.data || err.message);
    return res.status(500).json({ error: err.message });
  }
}