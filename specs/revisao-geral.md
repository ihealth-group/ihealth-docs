# Revisão geral da documentação da Extração

Revisão de linguagem, estrutura e exemplos de código da Extração de Dados Clínicos, feita após a atualização para o schema v2 (ver `specs/revisao-documentacao.md`, removida no commit `a0a5518` e disponível no histórico em `2cff068`).

Todos os itens foram considerados pertinentes. Nada aplicado ainda.

## Decisões

- **Critério para os exemplos de análise:** os códigos são só um norte para o analista. Exemplos são corrigidos para dar resultados coerentes; análises ambíguas ou de pouco valor, e qualquer item com proposta de remoção, são **removidos**.
- **Formatos (L6):** o cliente escolhe o formato; a maioria pede CSV e JSONL, mas pode receber só um.

## Escopo por versão

| Grupo                                    | v2 | v1 | Motivo                                                                                     |
| ---------------------------------------- | :-: | :-: | ------------------------------------------------------------------------------------------ |
| 1. Código que gera resultado errado (R)  | ✓  | ✓  | Clientes da v1 ainda usam os exemplos; a v1 recebe correções (sem mudar o schema v1).      |
| 2. Exemplos de pouco valor (B)           | ✓  | ✓  | Enxugar as análises vale para as duas versões.                                             |
| 3. Melhorias (M)                         | ✓  |    | Conteúdo novo.                                                                             |
| 4. Estrutura e duplicações (E)           | ✓  |    | Reorganização de conteúdo.                                                                 |
| 5. Linguagem e conteúdo (L)              | ✓  |    | Revisão de texto.                                                                          |

Na v1, as correções usam os valores do schema v1 (ex.: `PRESENTE` em vez de `PRESENT`; `CLINICAL_ATT` continua nas listas de categorias numéricas).

## 1. Código: problemas que geram resultado errado (v2 e v1)

- [x] **R1 — Entidades contadas mais de uma vez no CSV.** Uma entidade com várias relações aparece em várias linhas (mesmo `entity_id`). Contagens por `label`/`entity`, entidades por documento e estatísticas numéricas ficam infladas. Proposta: criar `entities = df.drop_duplicates('entity_id')` logo após o carregamento e usá-lo em todas as análises de entidade; nas agregações por documento, usar `nunique` em vez de `count`. Aplicado também às relações: cada relação aparece em duas linhas (head e tail), então as contagens de relações passam a usar só `relation_position == 'head'`. Afeta `csv-format` (distribuição, biomarcadores, agregações, exemplo completo) e `analysis-guidelines` (descritiva, biomarcadores, contexto clínico).
- [x] **R2 — `assertion` ignorado nas análises.** A documentação insiste na importância do contexto, mas distribuição, top entidades e padrões de tratamento contam também `ABSENT`, `FAMILY_HISTORY` e `OTHER` (ex.: "nega uso de metformina" entra como tratamento). Proposta: incluir um exemplo `pd.crosstab(entities['label'], entities['assertion'])` e filtrar `PRESENT` (ou excluir `ABSENT`/`FAMILY_HISTORY`/`OTHER`) nos exemplos clínicos.
- [x] **R3 — Estatísticas numéricas misturam unidades.** `groupby('normalized_entity')` junta, por ex., glicose em mg/dL e mmol/L. Proposta: agrupar por `['normalized_entity', 'unit']`.
- [x] **R4 — Clusters com `fillna(0)`.** Preencher exame ausente com 0 cria um valor clínico falso e distorce o K-means. Decisão: remover o exemplo de clusters.
- [x] **R5 — Comorbidades pelo texto bruto.** `DISEASE` não tem `normalized_entity`, então "diabetes", "DM2" e "diabetes mellitus" contam como doenças diferentes, e quase todo paciente vira "multimórbido". O padrão por tupla completa gera combinações únicas, pouco úteis. Proposta: avisar no comentário que o texto não é normalizado e trocar o padrão completo por **pares de doenças que coocorrem** (`itertools.combinations`). Vale para `analysis-guidelines` e `jsonl-format`.
- [x] **R6 — "Top 5 biomarcadores" na série temporal** pega as 5 primeiras colunas em ordem alfabética, não as mais frequentes. Proposta: selecionar pelos marcadores com mais registros.
- [x] **R7 — Tipo de `numeric_value`.** `data-structure` diz `string`, mas o JSONL traz número (`25`, `150000.0`) ou `""`. Proposta: descrever como "número (vazio quando ausente)" e usar `pd.to_numeric(..., errors='coerce')` nos exemplos.
- [x] **R8 — Campos vazios: texto × código.** `csv-format` diz que vazios são `""`, mas o pandas lê como `NaN`, e parte do código compara com `''`. Decisão: manter o carregamento padrão do pandas (vazios viram `NaN`), explicar isso na página e usar `.isna()`/`.notna()` em todo o código, sem a função `preenchido()`.

## 2. Código: exemplos de pouco valor como sugestão básica (v2 e v1)

- [x] **B1 — "Verificar anonimização"** (imprime 5 IDs): não verifica nada. Remover o bloco e manter só os bullets.
- [x] **B2 — Verificações de qualidade** "documentos sem entidades" e "relações órfãs": checam detalhes internos do pipeline, o cliente não tem o que fazer com o resultado e, no CSV, tendem a dar sempre 0. Proposta: manter só a tabela de preenchimento dos campos estruturados e a contagem de `assertion` vazio.
- [x] **B3 — `delivery`: "Processamento com Chunking"** adiciona uma coluna `processed_date` sem utilidade e o contador de progresso é aproximado; **"Processamento Incremental"** grava CSVs intermediários sem transformação. Proposta: remover os dois ou fundir em um único exemplo de leitura em partes para arquivos grandes.
- [x] **B4 — `delivery`: exemplo de logging.** Genérico, não é específico dos dados. Proposta: remover.
- [x] **B5 — Correlação entre biomarcadores.** Heatmap com `annot=True` fica ilegível com muitos marcadores, e a média de todos os tempos por paciente mistura momentos diferentes. Decisão: remover.
- [x] **B6 — Reprodutibilidade** (seed + dicionário de config com `python_version: '3.8+'`): pouco útil como código. Proposta: manter só como lista de boas práticas.

## 3. Código: melhorias sugeridas (úteis e básicas)

- [x] **M1 — JSONL → DataFrame.** Adicionar um exemplo que achata `clinical_entities`, `biomarkers` e `lab_tests` em DataFrames (com `pd.json_normalize`), já com `document_id`/`patient_id`. É o passo que quase todo analista vai precisar.
- [x] **M2 — Reconstruir relações a partir do CSV.** Exemplo filtrando `relation_position == 'head'` para obter uma linha por relação (equivalente ao `entities_relations` do JSONL).
- [x] **M3 — `lote_id` no processamento sequencial** (`delivery`), que é o exemplo principal; hoje só o paralelo tem.
- [x] **M4 — Imports em todos os blocos** que usam `pd`, `json`, `glob` e `plt`, para que cada bloco funcione copiado sozinho. Aplicado nos blocos independentes (validação de integridade em `delivery`); nas páginas com exemplos sequenciais, entrou uma nota explicando que os blocos usam imports e variáveis dos anteriores.

## 4. Estrutura e duplicações

- [ ] **E1 — `csv-format` × `analysis-guidelines`.** Distribuição, análise temporal, geográfica, relações e biomarcadores aparecem quase idênticos nas duas páginas. Proposta: `csv-format` fica com carregamento, estrutura e particularidades do formato; as análises ficam só em `analysis-guidelines`.
- [ ] **E2 — `jsonl-format`, fim da página.** Quatro listas se sobrepõem ("Impacto nas Análises", "Recomendações de Uso", "Vantagens do JSONL", "Quando Usar JSONL"). Proposta: uma única seção "Quando usar JSONL ou CSV". "Performance" hoje fala de tipo de análise, não de desempenho.
- [ ] **E3 — `limitations`, repetições.** "Campos vazios"/completude aparece três vezes (Limitações de Formato, Características dos Campos e sua subseção "Características dos Dados"). "Metadados de Análise" e "Elementos Essenciais" são duas listas do mesmo tema. Proposta: fundir.
- [ ] **E4 — `delivery`, hierarquia.** "Estratégias de Processamento" (`##`) pula direto para `####`, e o tema repete "Estratégias Recomendadas". Proposta: fundir as duas seções.
- [ ] **E5 — `analysis-guidelines`.** "Contexto Clínico" repete o bloco "Agregações" do CSV; "Boas Práticas > Validação" repete "Recomendações" de `limitations`. Proposta: manter cada tema em um lugar e linkar.

## 5. Linguagem e conteúdo

- [ ] **L1 — Maiúscula após rótulo em negrito.** Os textos novos usam "**Granularidade**: cada linha…", os antigos "**Granularidade**: Cada linha…". Proposta: padronizar com minúscula em todas as páginas.
- [ ] **L2 — `limitations`, "Verificação de Anonimização".** Pede ao cliente que confira se os dados estão "adequadamente anonimizados", o que transfere a ele uma responsabilidade que é da iHealth. Proposta: trocar por orientação de uso (não tentar reidentificar, não cruzar com bases identificadas).
- [ ] **L3 — `limitations`, "Validação Clínica".** "Estabeleça thresholds de confiança" não se aplica (os dados não têm score de confiança). Os exemplos "verificar se diabéticos apresentam poliúria" sugerem que a ausência de sintoma indica erro de extração, o que não é verdade. Proposta: reescrever com exemplos que fazem sentido (ex.: conferir amostras de entidades contra o texto esperado, comparar prevalências com a literatura).
- [ ] **L4 — Limitações próprias da v2 ausentes.** Não há menção a erros de inferência de `assertion`, a `OTHER` nem ao fato de os campos estruturados só virem quando a normalização é possível. Proposta: acrescentar em "Qualidade da Extração".
- [ ] **L5 — `delivery`, "Suporte".** "Esta documentação já contém todas as informações necessárias" soa categórico, e "entre em contato com nossa equipe técnica" não diz como. Proposta: frase neutra + e-mail de contato.
- [ ] **L6 — `delivery`, "Cada lote contém arquivos nos dois formatos".** Respondido: o cliente escolhe; a maioria pede os dois. Ajustar o texto.
- [ ] **L7 — `limitations`, "Contexto temporal".** Diz que relações temporais podem não ser preservadas; hoje existe `is_date_of`. Proposta: ajustar para "podem não ser capturadas em todos os casos".
