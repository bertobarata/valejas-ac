# Produto — Website Valejas Atlético Clube

> Atualizado a 14/09/2026. Substitui as instruções de projeto e o PRD de
> maio, ambos anteriores à reunião com a Direção e ambos a descrever
> modalidades e páginas que já não existem. Estão em `arquivo/`.

## O que é

O site oficial do Valejas Atlético Clube, fundado a 1 de novembro de 1966, em
Valejas, freguesia de Barcarena, concelho de Oeiras. Instituição de Utilidade
Pública, contribuinte 501 360 328.

Endereço: **valejasac.pt**

## Para quem

**Sócios, atletas e famílias.** Público multigeracional — dos petizes aos
seniores da Academia, dos 10 aos 60+ — e quase todo em telemóvel.

**A Direção**, que usa o site por dentro: publica comunicados, atualiza jogos e
classificação, escreve os plantéis e trata das encomendas da loja. Não são
pessoas técnicas, e o site é desenhado a contar com isso.

**Quem ainda não pertence.** Isto mudou em setembro: o site deixou de ser só a
casa de quem já cá está e passou a ter porta de entrada — inscrições nas
modalidades, ficha de sócio e loja. A chamada a ser sócio fecha todas as
páginas.

## Para que serve

1. **Ser a fonte oficial.** Os comunicados da Direção nascem aqui e ecoam nas
   redes, não o contrário
2. **Dar a vida do clube:** próximo jogo, calendário das 30 jornadas,
   classificação, plantéis, modalidades, instalações, história
3. **Tratar da relação com quem chega:** fazer-se sócio, inscrever-se numa
   modalidade, comprar equipamento
4. **Poupar trabalho ao clube:** o que entra pelo site chega formatado a quem
   trata dele, em vez de passar por WhatsApp e papelinhos

**Sucesso** = um sócio abre o site no telemóvel, vê o último comunicado e o
próximo jogo em segundos, e a Direção publica sem depender de ninguém técnico.

## Personalidade

Caloroso, orgulhoso, comunitário. Um clube de bairro com 60 anos e garra, mas
acolhedor para todas as idades e modalidades. Voz próxima e portuguesa — tuteia
—, direta, sem corporativês. Orgulho sem espetáculo.

**O mote manda:** *A união faz a força.* Está no hero da entrada, e o fecho de
todas as páginas diz a mesma coisa do lado de quem cá está: *«O Valejas é de
nós todos, e agora também é meu.»*

## Modalidades — a lista real

Fixada em reunião com a Direção a 13/09/2026. Saíram futebol de 11, futebol de
7, ciclismo, kung fu e yoga, que não existem. O ciclismo deu lugar ao
cicloturismo.

| Modalidade | Grupo | Compete | Notas |
|---|---|---|---|
| **Futsal** | Desporto | Sim | A modalidade âncora. Equipa A profissional no distrital da AF Lisboa, equipa B, e 7 escalões de formação. **Só masculino** |
| Atletismo | Desporto | Sim | Masculino e feminino, todos os escalões |
| Karate | Desporto | Sim | Jovens e adultos |
| Cicloturismo | Desporto | Sim | Passeios e provas |
| Judo | Desporto | Não | Só formação, em parceria com a Judokinhas Kobayashi |
| Dança | Cultura | Não | |
| Teatro | Cultura | Não | |

A **Academia Sénior** não é uma modalidade: é um programa comunitário para
maiores de 50, e tem página própria.

Todas têm **vagas limitadas** — fala-se com o clube antes de contar com ela.

## Páginas

| Rota | O que é |
|---|---|
| `/` | Hero com o mote, comunicado em destaque, próximo jogo, modalidades |
| `/comunicados`, `/comunicados/[slug]` | Comunicados oficiais da Direção |
| `/noticias` | Notícias do clube (vazio até haver conteúdo real) |
| `/jogos` | Próximo jogo, resultados, classificação e as 30 jornadas |
| `/equipas` | Plantéis de futsal, uma equipa de cada vez |
| `/modalidades` | As sete, em acordeão, com escalões e parcerias |
| `/academia-senior` | O programa dos maiores de 50 |
| `/clube` | A história: fundação, origens, onde estamos |
| `/clube/emblema` | A águia, as cores, o significado |
| `/instalacoes`, `/patrocinadores`, `/orgaos-sociais` | O resto do clube |
| `/inscricoes` | Como começar a praticar + formulário |
| `/inscricoes/direitos-de-imagem` | O termo RGPD, por extenso |
| `/socios-contacto`, `/socios/inscricao` | Ser sócio, e a ficha |
| `/loja`, `/loja/carrinho`, `/loja/condicoes` | Equipamento oficial |
| `/contactos` | Morada, horário, formulário |
| `/privacidade`, `/termos`, `/cookies` | Legais |
| `/direcao/*` | Área da Direção — fora dos motores de busca |
| `/studio` | Sanity Studio — só para quem tem conta no projeto |

## Decisões da Direção que governam o resto

- **Quota única de 1 €/mês.** Sem escalões, sem jóia de entrada
- **Qualquer pessoa se pode fazer sócio.** A Direção não chumba ninguém
- **Quem pratica tem de ser sócio primeiro**, sem exceção
- **O cartão de sócio levanta-se na sede.** Não se envia
- **Na loja, o levantamento é sempre na sede.** Não se envia para casa
- **O que não há em stock encomenda-se**, até 2 semanas
- **Direitos de imagem são obrigatórios** para todos os atletas
- **Sem estatísticas nos plantéis.** Um plantel, não uma ficha de scouting
- **Emails em domínio próprio**, não Gmail

## O que o site deliberadamente não faz

- **Não inventa conteúdo.** Já aconteceu uma vez — notícias com um reforço
  vindo do "São Paulo FC" para um clube de futsal de Barcarena — e foi apagado.
  Onde não há dados reais, mostra-se estado vazio
- **Não guarda dados pessoais** das inscrições nem dos pedidos: seguem por
  email e desaparecem. As encomendas são a exceção, e é por isso que o dataset
  do Sanity está privado
- **Não recolhe dados clínicos.** A ficha de atleta em papel pede-os; o site
  não, porque são categoria especial no RGPD (ver `TODO.md` §8)
- **Não publica nas redes sem a Direção carregar em publicar**

## Anti-referências

O produto falhou se parecer:

- Template genérico de clube: azul/cinza, calendário clip-art, patrocínios empilhados
- Corporate frio: navy com métricas grandes e fotografias de stock
- Feed de rede social com moldura de site
- Clichê desportivo: chamas, cromados, "guerreiros", gradientes agressivos
