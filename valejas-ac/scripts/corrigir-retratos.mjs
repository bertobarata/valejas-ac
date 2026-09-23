import { createClient } from "@sanity/client";
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01", useCdn: false,
});

const assets = await client.fetch(`*[_type=="sanity.imageAsset" && defined(label)]{_id,label,"ar":metadata.dimensions.aspectRatio}`);
const jogadores = await client.fetch(`*[_type=="jogador" && defined(fotografia.asset)]{_id,nome,"ar":fotografia.asset->metadata.dimensions.aspectRatio}`);

const nfc = (s) => s.normalize("NFC");
const patches = [];

for (const j of jogadores) {
  const patch = {};
  // Nomes vindos do sistema de ficheiros do macOS chegam decompostos.
  if (j.nome !== nfc(j.nome)) patch.nome = nfc(j.nome);

  // Retrato deitado quando existe pose ao alto do mesmo jogador: o cartão
  // é 3:4 e um 3:2 perde metade da pessoa.
  if (j.ar > 1) {
    const doJogador = assets.filter((a) => nfc(a.label.split(" — ")[0]) === nfc(j.nome));
    const aoAlto = doJogador.filter((a) => a.ar < 1).sort((a, b) => a.label.localeCompare(b.label))[0];
    if (aoAlto) {
      patch.fotografia = {
        _type: "image",
        asset: { _type: "reference", _ref: aoAlto._id },
        hotspot: { x: 0.5, y: 0.32, height: 0.5, width: 0.5 },
      };
      console.log(`retrato  ${nfc(j.nome).padEnd(20)} → ${aoAlto.label.split(" — ")[1]}`);
    } else {
      console.log(`SEM ALTERNATIVA  ${nfc(j.nome)} — fica deitada`);
    }
  }
  if (patch.nome) console.log(`nome     ${j.nome} → NFC`);
  if (Object.keys(patch).length) patches.push({ patch: { id: j._id, set: patch } });
}

if (patches.length) await client.mutate(patches);
console.log(`\n${patches.length} documentos corrigidos.`);
