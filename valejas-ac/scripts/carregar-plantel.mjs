/**
 * Carrega o plantel fotografado para o Sanity.
 *
 * Faz upload dos 51 retratos preparados e cria os 25 jogadores com a
 * pose1 ligada, `ativo: false` e números provisórios — nada aparece no
 * site até a Direção confirmar a lista em /direcao/plantel.
 *
 * Correr da raiz de valejas-ac:
 *   node --env-file=.env.local <caminho>/carregar-plantel.mjs [--dry]
 */
import { readdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { createClient } from "@sanity/client";

const RAIZ = "/Users/berto_barata/Developer/WebSite Valejas/FOTOS/_prontas/plantel";
const SECO = process.argv.includes("--dry");

/* Números lidos nas camisolas dos retratos (17/09), e só esses. Eltom e
 * Gonçalo liam ambos 2; Guilherme e Miguel Graça liam ambos 3 — leitura
 * duvidosa não entra, fica provisória como as outras. */
const NUMEROS_LIDOS = {
  "Afonso Semedo": 13, "André Neto": 12, "André Taveres": 29,
  "Bruno Fernandes": 23, "Cassiano Mota": 19, "Diogo Batista": 18,
  "Gustavo Fernandes": 17, "Miguel Paiva": 10, "Rodrigo Vieira": 11,
  "Vasco Novo": 48,
};

const ACENTOS = { "Andre Neto": "André Neto", "Andre Taveres": "André Taveres" };
const EQUIPAS = { "Equipa A": "a", "Equipa B": "b" };

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET,
  token:     process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

/** "Andre Neto - pose2.jpg" → { jogador: "André Neto", pose: "pose2" } */
function analisar(ficheiro) {
  const semExt = basename(ficheiro, extname(ficheiro));
  const [cru, pose] = semExt.split(" - ");
  const limpo = cru.replace(/_+$/, "").trim();
  return { jogador: ACENTOS[limpo] ?? limpo, pose: pose ?? "unica" };
}

/** pose1 manda; sem ela, a primeira por ordem. */
function escolherRetrato(poses) {
  return poses.find((p) => p.pose === "pose1")
      ?? poses.slice().sort((a, b) => a.pose.localeCompare(b.pose))[0];
}

function idDoDoc(equipa, nome) {
  const chave = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `jogador-${equipa}-${chave}`;
}

/* Contador único para as duas equipas: 80-94 não toca em nenhum
 * número lido, e salta à vista de quem for confirmar a lista. */
let provisorio = 80;

for (const [pasta, equipa] of Object.entries(EQUIPAS)) {
  const dir = join(RAIZ, pasta);
  const porJogador = new Map();

  for (const f of readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
    const { jogador, pose } = analisar(f);
    if (!porJogador.has(jogador)) porJogador.set(jogador, []);
    porJogador.get(jogador).push({ pose, ficheiro: f });
  }

  for (const [nome, poses] of [...porJogador].sort()) {
    const numero = NUMEROS_LIDOS[nome] ?? provisorio++;
    const retrato = escolherRetrato(poses);
    const _id = idDoDoc(equipa, nome);
    const marca = NUMEROS_LIDOS[nome] ? "lido" : "provisório";

    if (SECO) {
      console.log(`${equipa} · ${String(numero).padStart(2)} ${marca.padEnd(10)} ${nome.padEnd(20)} ${retrato.ficheiro}  (${poses.length} pose${poses.length > 1 ? "s" : ""})`);
      continue;
    }

    /* Todas as poses sobem: trocar de retrato no Studio passa a ser
     * escolher outra da biblioteca, sem novo carregamento. O Sanity
     * desduplica por hash, por isso repetir o script não multiplica. */
    let escolhido;
    for (const p of poses) {
      const asset = await client.assets.upload("image", readFileSync(join(dir, p.ficheiro)), {
        filename: p.ficheiro,
        label: `${nome} — ${p.pose}`,
      });
      if (p === retrato) escolhido = asset._id;
      process.stdout.write(".");
    }

    await client.createIfNotExists({
      _id,
      _type: "jogador",
      nome,
      numero,
      posicao: "Universal",   // por confirmar — a Direção escolhe em /direcao
      equipa,
      capitao: false,
      ativo: false,           // fora do site até a lista estar certa
      fotografia: {
        _type: "image",
        asset: { _type: "reference", _ref: escolhido },
        hotspot: { x: 0.5, y: 0.32, height: 0.5, width: 0.5 }, // cara, não tronco
      },
    });
    console.log(` ${equipa} · ${numero} ${nome} (${marca}, ${poses.length} poses)`);
  }
}

console.log(SECO ? "\nEnsaio — nada foi escrito." : "\nFeito.");
