// Recomendação 100% offline por palavras-chave (sem API, sem internet).
const regras: Record<"headset" | "mouse" | "teclado", string[]> = {
  headset: ["som", "audio", "áudio", "ouvir", "fone", "microfone", "mic", "conversar", "voz", "discord", "música", "musica", "passos", "imers", "conforto", "stream", "call"],
  mouse: ["fps", "mira", "tiro", "cs", "valorant", "precis", "rápid", "rapid", "agil", "ágil", "dpi", "clique", "moba", "lol", "aim", "reflexo"],
  teclado: ["digitar", "digita", "escrever", "texto", "trabalho", "estudo", "programar", "código", "codigo", "mecânic", "mecanic", "tecla", "rgb", "estilo", "atalho", "mmo"],
};

const motivos = {
  headset: "Você valoriza áudio e comunicação: o Headset Pulse oferece som imersivo e conforto para longas sessões.",
  mouse: "Você precisa de precisão e resposta rápida: o Mouse Velocity entrega agilidade em cada movimento.",
  teclado: "Você digita bastante ou quer desempenho e estilo: o Teclado Phantom é ideal para sua estação.",
};

export function recomendarLocal(texto: string) {
  const t = texto.toLowerCase();
  let melhor: keyof typeof regras = "mouse";
  let max = 0;
  for (const id of Object.keys(regras) as (keyof typeof regras)[]) {
    const pontos = regras[id].filter((p) => t.includes(p)).length;
    if (pontos > max) { max = pontos; melhor = id; }
  }
  if (max === 0) return { id: "mouse", reason: "Não identifiquei uma necessidade específica, então sugerimos nosso item mais versátil para qualquer jogo." };
  return { id: melhor, reason: motivos[melhor] };
}
