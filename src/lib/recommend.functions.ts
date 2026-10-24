import { createServerFn } from "@tanstack/react-start";

const IDS = ["headset", "mouse", "teclado"] as const;

export const recommendProduct = createServerFn({ method: "POST" })
  .inputValidator((input: { need: string }) => {
    const need = String(input?.need ?? "").trim();
    if (need.length < 3 || need.length > 500) throw new Error("Descreva sua necessidade (3 a 500 caracteres).");
    return { need };
  })
  .handler(async ({ data }) => {
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { error: "Recomendação indisponível no momento." };

    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        maxRetries: 0,
        system:
          "Você é o assistente da NEXO STORE. Produtos: headset = Headset Gamer Pulse (R$ 199,90, som imersivo e conforto); mouse = Mouse Gamer Velocity (R$ 129,90, precisão e agilidade); teclado = Teclado Mecânico Phantom (R$ 249,90, desempenho e estilo). Recomende exatamente UM. Responda em duas linhas: na primeira apenas o id (headset, mouse ou teclado); na segunda uma justificativa curta em português (máx. 2 frases).",
        messages: [{ role: "user", content: data.need }],
        providerOptions: {
          openai: { store: false, forceReasoning: true, reasoningEffort: "low", include: ["reasoning.encrypted_content"] },
        },
      });
      const text = (await result.text).trim();
      const [first, ...rest] = text.split("\n");
      const id = IDS.find((i) => (first ?? "").toLowerCase().includes(i));
      if (!id) return { error: "Não foi possível gerar uma recomendação. Tente descrever de outra forma." };
      return { id, reason: rest.join(" ").trim() };
    } catch (e: unknown) {
      const status = (e as { statusCode?: number })?.statusCode;
      console.error("recommend error", status, e);
      if (status === 429) return { error: "Muitas solicitações. Aguarde alguns instantes." };
      if (status === 402) return { error: "Créditos de IA esgotados." };
      return { error: "Recomendação indisponível no momento." };
    }
  });
