import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const event = req.body;

    const payment = event.data?.object || {};

    const orderId = payment.external_reference;
    const status = payment.status;

    if (!orderId) {
      return res.status(400).json({ error: "Sem external_reference" });
    }

    // mapear status
    let newStatus = "pending";

    if (status === "approved") newStatus = "approved";
    if (status === "rejected") newStatus = "rejected";
    if (status === "cancelled") newStatus = "cancelled";

    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus
      })
      .eq("id", orderId);

    if (error) {
      console.error("Erro ao atualizar pedido:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });

  } catch (err: any) {
    console.error("Erro no webhook:", err);
    return res.status(500).json({ error: err.message });
  }
}