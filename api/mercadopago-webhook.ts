import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const event = req.body;
    const payment = event.data?.object?.payment || event.data?.object || {};

    const { error } = await supabase.from("order").insert([
      {
        user_id: payment.payer?.id || "desconhecido",
        total: payment.transaction_amount || 0,
        status: payment.status || "pending",
        payment_method: "Mercado Pago",
        created_at: new Date()
      }
    ]);

    if (error) {
      console.error("Erro ao salvar pedido:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Erro no webhook:", err);
    res.status(500).json({ error: err.message });
  }
}