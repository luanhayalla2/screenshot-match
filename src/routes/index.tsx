import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2 } from "lucide-react";
import { recommendProduct } from "@/lib/recommend.functions";
import { Gamepad2, Menu, X, MousePointerClick, Hash, ClipboardCheck, Info, ArrowRight, ImageOff } from "lucide-react";
import hero from "@/assets/hero.jpg";
import headset from "@/assets/headset.jpg";
import mouse from "@/assets/mouse.jpg";
import keyboard from "@/assets/keyboard.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXO STORE — Simulador de Compras" },
      { name: "description", content: "Loja fictícia de acessórios gamer para simular compras. Projeto acadêmico SENAC." },
      { property: "og:title", content: "NEXO STORE — Simulador de Compras" },
      { property: "og:description", content: "Seu próximo nível começa aqui. Simule sua compra de acessórios gamer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Mesmos valores exibidos nos cartões — futuro script.js
const produtos = [
  { id: "headset", nome: "Headset Gamer Pulse", descricao: "Som imersivo e conforto para suas partidas.", preco: 199.9, img: headset },
  { id: "mouse", nome: "Mouse Gamer Velocity", descricao: "Precisão e agilidade em cada movimento.", preco: 129.9, img: mouse },
  { id: "teclado", nome: "Teclado Mecânico Phantom", descricao: "Desempenho e estilo para sua estação gamer.", preco: 249.9, img: keyboard },
];

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Pedido = { nome: string; itens: { nome: string; qtd: number; sub: number }[]; total: number; data: string };
const CHAVE = "nexo-pedidos";
const lerPedidos = (): Pedido[] => { try { return JSON.parse(localStorage.getItem(CHAVE) || "[]"); } catch { return []; } };

function simularCompra(): Pedido | null {
  let nome = "";
  while (!nome) {
    const r = prompt("Qual é o seu nome?", "");
    if (r === null) return null;
    nome = r.trim();
    if (!nome) alert("Digite seu nome para continuar.");
  }
  let total = 0;
  let resumo = "";
  const itens: Pedido["itens"] = [];
  for (const p of produtos) {
    let qtd = NaN;
    while (Number.isNaN(qtd) || qtd < 0) {
      const r = prompt(`Quantas unidades de "${p.nome}" (${brl(p.preco)})? Digite 0 para não comprar.`, "0");
      if (r === null) return null;
      qtd = Number.parseInt(r, 10);
      if (Number.isNaN(qtd) || qtd < 0) alert("Digite um número inteiro igual ou maior que zero.");
    }
    if (qtd > 0) {
      const sub = qtd * p.preco;
      total += sub;
      itens.push({ nome: p.nome, qtd, sub });
      resumo += `${qtd}x ${p.nome} = ${brl(sub)}\n`;
    }
  }
  if (total === 0) { alert("Nenhum produto foi selecionado."); return null; }
  alert(`Resumo da simulação de ${nome}:\n\n${resumo}\nTotal: ${brl(total)}`);
  const pedido = { nome, itens, total, data: new Date().toLocaleString("pt-BR") };
  localStorage.setItem(CHAVE, JSON.stringify([pedido, ...lerPedidos()]));
  return pedido;
}

function PainelPedidos({ pedidos, limpar }: { pedidos: Pedido[]; limpar: () => void }) {
  return (
    <section id="pedidos" className="mx-auto max-w-6xl px-5 pb-24">
      <div className="card-surface p-8 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold md:text-3xl">Pedidos simulados</h2>
          {pedidos.length > 0 && <button type="button" onClick={limpar} className="text-sm text-muted-foreground hover:text-foreground">Limpar pedidos</button>}
        </div>
        {pedidos.length === 0 ? (
          <p className="mt-4 text-muted-foreground">Nenhum pedido ainda. Faça uma simulação para vê-la aqui.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground"><tr><th className="py-2 pr-4">Nome</th><th className="py-2 pr-4">Produtos</th><th className="py-2 pr-4">Data</th><th className="py-2 text-right">Total</th></tr></thead>
              <tbody>
                {pedidos.map((p, i) => (
                  <tr key={i} className="border-t align-top">
                    <td className="py-3 pr-4 font-medium">{p.nome}</td>
                    <td className="py-3 pr-4">{p.itens.map((it) => <div key={it.nome}>{it.qtd}x {it.nome}</div>)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{p.data}</td>
                    <td className="py-3 text-right font-display font-bold text-cyan">{brl(p.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function Logo() {
  return (
    <a href="#inicio" className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary"><Gamepad2 className="h-5 w-5" aria-hidden /></span>
      NEXO <span className="text-cyan">STORE</span>
    </a>
  );
}

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [erro, setErro] = useState(false);
  if (erro) return <div className="grid aspect-[5/4] place-items-center text-muted-foreground"><ImageOff aria-hidden /><span className="sr-only">{alt}</span></div>;
  return <img src={src} alt={alt} onError={() => setErro(true)} loading="lazy" width={912} height={736} className="aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-105" />;
}

function Index() {
  const [menu, setMenu] = useState(false);
  const links = [["#inicio", "Início"], ["#produtos", "Produtos"], ["#como-funciona", "Como funciona"]];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Logo />
          <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
            {links.map(([h, l]) => <a key={h} href={h} className="text-sm text-muted-foreground hover:text-foreground">{l}</a>)}
            <a href="#simular" className="btn-primary text-sm">Simular compra</a>
          </nav>
          <button className="md:hidden" aria-label={menu ? "Fechar menu" : "Abrir menu"} aria-expanded={menu} onClick={() => setMenu(!menu)}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <nav aria-label="Menu móvel" className="flex flex-col gap-4 border-t px-5 py-5 md:hidden">
            {links.map(([h, l]) => <a key={h} href={h} onClick={() => setMenu(false)}>{l}</a>)}
            <a href="#simular" onClick={() => setMenu(false)} className="btn-primary">Simular compra</a>
          </nav>
        )}
      </header>

      <main>
        <section id="inicio" className="relative overflow-hidden">
          <img src={hero} alt="Headset, mouse e teclado gamer com iluminação azul e roxa" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover object-right opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
          <div className="relative mx-auto max-w-6xl px-5 py-28 md:py-40">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan">Acessórios gamer & tecnologia</p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight md:text-6xl">Seu próximo nível <span className="text-gradient">começa aqui.</span></h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">Descubra acessórios que transformam sua experiência gamer e escolha seus favoritos para simular sua compra.</p>
            <a href="#produtos" className="btn-primary mt-8">Explorar produtos <ArrowRight className="h-4 w-4" aria-hidden /></a>
          </div>
        </section>

        <section id="produtos" className="mx-auto max-w-6xl px-5 py-24">
          <h2 className="text-3xl font-bold md:text-4xl">Produtos em destaque</h2>
          <p className="mt-2 text-muted-foreground">Escolha seus favoritos para a simulação.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((p) => (
              <article key={p.id} data-produto={p.id} data-preco={p.preco} className="card-surface group overflow-hidden transition-colors hover:border-primary">
                <div className="relative overflow-hidden">
                  <ProductImage src={p.img} alt={p.nome} />
                  <span className="absolute left-3 top-3 rounded-full border border-cyan/40 bg-background/70 px-3 py-1 text-xs font-medium text-cyan">Destaque</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{p.nome}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.descricao}</p>
                  <p className="mt-5 font-display text-2xl font-bold text-cyan">{brl(p.preco)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Recomendador />

        <section id="como-funciona" className="border-y bg-card/40">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <h2 className="text-3xl font-bold md:text-4xl">Como funciona</h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {[[MousePointerClick, "Escolha seus produtos favoritos."], [Hash, "Informe as quantidades desejadas."], [ClipboardCheck, "Confira o resultado da simulação."]].map(([Icon, t], i) => {
                const I = Icon as typeof Hash;
                return (
                  <li key={i} className="card-surface p-6">
                    <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-cyan"><I aria-hidden /></span><span className="font-display text-sm text-muted-foreground">Etapa {i + 1}</span></div>
                    <p className="mt-4 text-lg font-medium">{t as string}</p>
                  </li>
                );
              })}
            </ol>
            <p className="mt-8 flex items-start gap-2 text-sm text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0 text-violet" aria-hidden />Esta é uma demonstração acadêmica e não realiza pagamentos reais.</p>
          </div>
        </section>

        <section id="simular" className="mx-auto max-w-6xl px-5 py-24">
          <div className="card-surface relative overflow-hidden p-8 md:p-14">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet/20 blur-3xl" aria-hidden />
            <div className="relative grid items-center gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">Pronto para simular sua compra?</h2>
                <ul className="mt-6 space-y-3 text-muted-foreground">
                  {["Clique no botão para iniciar.", "Informe a quantidade de cada produto.", "Digite zero para não comprar um produto.", "Confira o resultado apresentado pelo navegador."].map((t) => (
                    <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="md:text-center">
                <button id="btn-simular" type="button" onClick={simularCompra} className="btn-primary px-10 py-4 text-lg">Simular compra</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 text-sm text-muted-foreground md:grid-cols-2">
          <div className="space-y-2">
            <Logo />
            <p>Seu próximo nível começa aqui.</p>
            <p>Tecnologias: HTML, CSS e JavaScript.</p>
          </div>
          <div className="space-y-2 md:text-right">
            <p>Projeto desenvolvido por Luã Hayalla Oliveira Silva</p>
            <p>Desafio 1 — Minha Loja: Simulador de Compras · SENAC</p>
            <p>© 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Recomendador() {
  const recommend = useServerFn(recommendProduct);
  const [need, setNeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<{ id?: string; reason?: string; error?: string } | null>(null);
  const produto = produtos.find((p) => p.id === res?.id);

  async function enviar(e: import("react").FormEvent) {
    e.preventDefault();
    setLoading(true); setRes(null);
    try { setRes(await recommend({ data: { need } })); }
    catch { setRes({ error: "Descreva sua necessidade (3 a 500 caracteres)." }); }
    finally { setLoading(false); }
  }

  return (
    <section id="recomendar" className="mx-auto max-w-6xl px-5 pb-24">
      <div className="card-surface p-8 md:p-10">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan"><Sparkles className="h-4 w-4" aria-hidden />Assistente NEXO</p>
        <h2 className="mt-3 text-2xl font-bold md:text-3xl">Não sabe qual escolher?</h2>
        <p className="mt-2 text-muted-foreground">Conte o que você precisa e nossa IA recomenda um dos nossos produtos.</p>
        <form onSubmit={enviar} className="mt-6 flex flex-col gap-3 md:flex-row">
          <label htmlFor="necessidade" className="sr-only">Descreva o que você precisa</label>
          <input id="necessidade" value={need} onChange={(e) => setNeed(e.target.value)} maxLength={500}
            placeholder="Ex.: Jogo FPS competitivo e preciso de mira rápida"
            className="flex-1 rounded-full border bg-background px-5 py-3 text-foreground placeholder:text-muted-foreground" />
          <button type="submit" disabled={loading || need.trim().length < 3} className="btn-primary disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
            {loading ? "Analisando..." : "Recomendar produto"}
          </button>
        </form>
        <div aria-live="polite">
          {res?.error && <p className="mt-5 text-sm text-destructive">{res.error}</p>}
          {produto && (
            <div className="mt-6 flex items-center gap-5 rounded-xl border border-primary/50 bg-background/50 p-4">
              <img src={produto.img} alt={produto.nome} width={912} height={736} className="h-20 w-24 rounded-lg object-cover" />
              <div>
                <p className="font-display text-lg font-semibold">{produto.nome} <span className="text-cyan">{brl(produto.preco)}</span></p>
                <p className="mt-1 text-sm text-muted-foreground">{res?.reason}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
