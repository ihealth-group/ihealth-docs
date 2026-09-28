# Spec — Revisão da documentação (Bem-vindo + Extração de Dados Clínicos)

> Status: **rascunho** · Última revisão: 2026-09-28
>
> Arquivo de trabalho interno. Fica fora de `docs/` de propósito, para não ser publicado pelo Docusaurus.

## 1. Contexto

O site `docs.ihealthgroup.com.br` documenta **dois produtos**:

| Produto                        | Pasta                             | Estado                                               |
| ------------------------------ | --------------------------------- | ---------------------------------------------------- |
| **Plataforma iHealth**         | `docs/plataforma/`                | Atualizada (taxonomia nova, novos módulos)           |
| **Extração de Dados Clínicos** | `docs/clinical-data-extraction/`  | Desatualizada (schema antigo, 7 páginas)             |

A página **Bem-vindo** (`docs/intro.md`) não é um produto. É a porta de entrada institucional que apresenta os dois.

### Leitura do pedido de produto

A issue fala em "três seções". Na prática, são **uma página de entrada + dois produtos**. Ajustes de leitura:

- **Navegação (item 3 da issue):** o menu lateral (`sidebars.js`) e o rodapé (`docusaurus.config.js`) já são únicos e globais. Produto confirmou que o problema relatado **não existe**. Item descartado.
- **"Tom alinhado com a Plataforma":** os dois produtos têm públicos diferentes. A Plataforma é para o usuário da interface (texto corrido, sem código). A Extração é para cientistas e analistas de dados que recebem arquivos (schema + exemplos de código). Alinhar significa **terminologia e apresentação consistentes**, e não igualar o formato. Confirmado por produto: os exemplos de código ficam (D10).
- **Extração desatualizada:** o schema de entrega mudou em 21/09/2026. Mais do que revisar texto, é preciso **versionar**, para que clientes com entregas anteriores continuem consultando a documentação correspondente.

## 2. Decisões tomadas

| #  | Decisão                                                                                                                                                                                                  |
| -- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1 | A Extração passa a ter **v2 (atual)** e **v1 (legado)**.                                                                                                                                               |
| D2 | A **v2** ocupa os endereços atuais (`/clinical-data-extraction/...`) e é a única versão no menu lateral.                                                                                               |
| D3 | A **v1** fica em `docs/clinical-data-extraction/v1/`, fora do `sidebars.js`, com `displayed_sidebar: docsSidebar` (abre com o menu normal, mas não aparece nele).   |
| D4 | Um **card na v2** (intro) aponta para a v1; **cada página da v1** tem um aviso de que não é mais atualizada, com link para a v2.                                                                        |
| D5 | A v1 é **temporária** e será removida depois. Não usamos o versionamento nativo do Docusaurus, porque ele versionaria também a Bem-vindo e a Plataforma.                                              |
| D6 | A v1 é uma **cópia congelada** do conteúdo de hoje. Recebe apenas: o aviso, o frontmatter, a correção dos links Anterior/Próximo e a correção de erros nos exemplos (sem mudar o schema v1).                                                                      |
| D7 | **Corte de versão: 21/09/2026.** Entregas a partir dessa data seguem a v2; anteriores, a v1.                                                                                                             |
| D8 | A v2 documenta **apenas o estado atual**. Sem seção "o que mudou" nem comparações com a v1. A única referência à v1 é o card de D4.                                                                      |
| D9 | Contatos: site **sem `www`** (`https://ihealthgroup.com.br`) na Bem-vindo e no rodapé; e-mail `oportunidades@ihealthgroup.com.br` mantido; link da Plataforma (`https://plataforma.ihealthgroup.tec.br/`) **na Bem-vindo e no rodapé**. |
| D10 | Os **exemplos de código da Extração ficam**. Apenas ajustar ao schema v2 e corrigir erros; sem enxugar nem remover seções.                                                                              |
| D11 | Textos institucionais da Bem-vindo estão corretos quanto às informações; **revisar apenas a linguagem**.                                                                                               |
| D12 | Regras de entrega da v1 continuam valendo na v2: lotes de 10–50 pacientes, nomenclatura `projectname_patients_part_NNN`, mesmos locais de entrega.                                                     |

## 3. Referência — schema da Extração v2

Fonte da verdade para reescrever a v2 (informado por produto em 2026-09-28).

### 3.1 `assertion`

| Valor            | Nome na Plataforma   | Significado                                                                                                                  |
| ---------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `PRESENT`        | Presente             | Condição ativa no paciente naquele momento                                                                                   |
| `INVESTIGATION`  | Em investigação      | Hipótese, suspeita ou diagnóstico em apuração                                                                                |
| `HISTORY`        | Histórico            | Esteve presente no passado, pode não estar mais ativo                                                                        |
| `FAMILY_HISTORY` | Histórico familiar   | Refere-se a um familiar, não ao paciente                                                                                     |
| `ABSENT`         | Ausente              | Termo negado no texto                                                                                                        |
| `OTHER`          | — (só na Extração)   | Menção fora da jornada clínica do paciente: ex. doença citada como referência, estudo ou em documento de apoio, sem ser do paciente nem estar em investigação |

Valores antigos que saem: `PRESENTE`, `AUSENTE`, `POSSIVEL`, `HISTORICO` (os valores passam do português para o inglês).

**Labels com `assertion`** (mesmas da Plataforma): `FINDING`, `INJURY`, `DISEASE`, `PHARM_SUBSTANCE`, `PROCEDURE`, `MEDICAL_DEVICE`. Nas demais, o campo vem vazio e isso não indica falha.

### 3.2 `label`

| Valor              | Nome na Plataforma  |
| ------------------ | ------------------- |
| `FINDING`          | Achado clínico      |
| `INJURY`           | Lesão               |
| `DISEASE`          | Doença              |
| `PHARM_SUBSTANCE`  | Fármaco             |
| `PROCEDURE`        | Procedimento        |
| `STAGE`            | Estadiamento        |
| `SCALE`            | Escala              |
| `MEDICAL_DEVICE`   | Dispositivo médico  |
| `BODY_PART`        | Parte do corpo      |
| `TEMPORAL_CONCEPT` | — (só na Extração)  |
| `BIOMARKER`        | Biomarcador         |
| `LAB_TEST`         | Exame laboratorial  |

Labels que saem: `SYMPTOM`, `VENT_SUPPORT`, `CLINICAL_ATT`, `HCARE_ACTIVITY`, `BODY_LOC`, `MORPHOLOGY`.

### 3.3 `relation_type`

`is_date_of` · `finding_has_anatomic_site` · `may_treat` · `procedure_has_target_anatomy` · `disease_has_anatomic_site` · `disease_has_associated_disease` · `disease_has_biomarker` · `disease_has_scale` · `disease_has_stage` · `injury_has_anatomic_site` · `procedure_has_associated_device` · `medical_device_has_target_anatomy` · `disease_has_oncologic_finding`

Tipos que saem: `is_associated_anatomic_site_of`, `is_qualifier_of`, `may_diagnose`, `disease_has_primary_anatomic_site`, `induced_by`, `disease_has_finding`, `disease_has_metastatic_anatomic_site`, `disease_has_associated_anatomic_site`.

`has_quantifier_value` **não é documentada e não aparece em `entities_relations`**. É uma relação interna, que liga o valor medido ao exame/biomarcador e dá origem a `numeric_value`/`unit` nos campos estruturados (3.4).

A documentação tem uma tabela com descrição + exemplo por relação. Descrições redigidas e validadas por produto (Q12).

### 3.4 Campos estruturados

- Aplicam-se **apenas a `BIOMARKER` e `LAB_TEST`**.
- Sai: `condition` (era só de `CLINICAL_ATT`).
- Entram: `method` (**`BIOMARKER` e `LAB_TEST`**) e `score` (**apenas `BIOMARKER`**).
- Sai também: `loinc_code`.
- Ordem no CSV: `normalized_entity`, `specific_marker`, `method`, `detection_status`, `score`, `numeric_value`, `unit`.

| Campo               | `BIOMARKER` | `LAB_TEST` | JSONL                |
| ------------------- | :---------: | :--------: | -------------------- |
| `normalized_entity` | ✓           | ✓          | nível da entidade    |
| `specific_marker`   | ✓           | ✓          | nível da entidade    |
| `method`            | ✓           | ✓          | nível da entidade    |
| `detection_status`  | ✓           | ✓          | `result`             |
| `score`             | ✓           |            | `result`             |
| `numeric_value`     | ✓           | ✓          | `result`             |
| `unit`              | ✓           | ✓          | `result`             |

### 3.5 Terminologia

**Removida por completo.** Saem `terminology`, `term_code`, `term_desc` (CSV) e o objeto `el` (JSONL), junto com as menções a CID-10, ATC e TUSS.

### 3.6 CSV — cabeçalho

Confirmado por produto: saem os campos de terminologia e `loinc_code`; entram `method` e `score`; o restante não muda.

```csv
document_id,document_date,patient_id,case_id,gender,birthdate,death,provider_state_code,provider_type,entity_id,entity,label,assertion,normalized_entity,specific_marker,method,detection_status,score,numeric_value,unit,relation_type,relation_entity,relation_position
```

### 3.7 JSONL — estrutura

- `preds` passa a ter: `clinical_entities`, `biomarkers`, `lab_tests`, `entities_relations` (sai `vital_signs`).
- `clinical_entities` sem o objeto `el`.
- `biomarkers` sem `loinc_code`; `method` no nível da entidade e `score` dentro de `result`:

```json
{
  "entity_id": "doc_123_130",
  "entity": "KI67 25%",
  "label": "BIOMARKER",
  "normalized_entity": "KI67",
  "specific_marker": "",
  "method": "",
  "result": {
    "detection_status": "",
    "score": "",
    "numeric_value": 25,
    "unit": "%"
  }
}
```

- `lab_tests`: `method` no nível da entidade; sem `score`; `result` com `detection_status`, `numeric_value`, `unit`.

## 4. Perguntas

### 4.1 Respondidas

| #  | Pergunta                                          | Resposta                                                                  |
| -- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| Q1  | Valores de `label` e `assertion`                  | Ver 3.1 e 3.2                                                             |
| Q2  | Mudanças no CSV/JSONL                             | Ver 3.4 a 3.7                                                             |
| Q3  | Categorias exclusivas e relações                  | Ver 3.2 e 3.3 (`TEMPORAL_CONCEPT` fica; demais exclusivas saem)           |
| Q4  | Regras de entrega                                 | Continuam iguais (D12)                                                    |
| Q5  | Manter exemplos de código?                        | Sim; só ajustar e corrigir erros (D10)                                    |
| Q6  | Data de corte v1/v2                               | 21/09/2026 (D7)                                                           |
| Q7  | Contatos                                          | D9                                                                        |
| Q8  | Textos institucionais                             | Informações corretas; revisar só a linguagem (D11)                        |
| Q9  | Menu sem a Plataforma                             | Inconsistência do relato; não há problema                                 |
| Q10 | Significado de `OTHER`                            | Ver 3.1                                                                   |
| Q11 | `BIOMARKER` e `LAB_TEST` são labels?              | Sim (3.2)                                                                 |
| Q13 | Aplicabilidade de `score`                         | Só `BIOMARKER`; no JSONL em `result.score` (3.4)                          |
| Q14 | Cabeçalho do CSV                                  | Confirmado (3.6)                                                          |
| Q15 | Posição de `method`/`score` no JSONL              | `method` no nível da entidade; `score` em `result` (3.7)                  |
| Q16 | Labels com `assertion`                            | As mesmas da Plataforma (3.1)                                             |
| Q17 | `payer_name` continua?                            | Sim                                                                       |
| Q19 | Onde entra o link da Plataforma                   | Bem-vindo e rodapé (D9)                                                   |
| Q12 | Descrições e exemplos das relações                | Validados por produto como redigidos (3.3 / `data-structure.md`)          |
| Q20 | Valores de exemplo de `method`, `detection_status`, `score` | Validados (`imuno-histoquímica`, `POS`, `3+`)                  |
| Q21 | Nomes "Conceito temporal" e "Outro"                | Validados                                                                 |
| Q22 | LOINC da v1 (HER2 `48676-1`, KI67 `29593-1`)      | Validados                                                                 |
| Q23 | `relation_position` = posição da entidade da linha | Confirmado, vale para v1 e v2                                            |

### 4.2 Em aberto

| #   | Pergunta                                                                                                                                                                | Bloqueia                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Q18 | Prazo para remover a v1 do ar.                                                                                                                                          | nada (ainda não definido; só registro)    |

## 5. Escopo de alterações

### 5.1 Página Bem-vindo — `docs/intro.md` e rodapé

- [x] Reestruturar "Documentação Disponível" com os **dois produtos no mesmo nível e mesmo formato**:
  - hoje a Plataforma é uma seção solta (`## Plataforma iHealth`, l. 19–32) e só a Extração está em "Documentação Disponível" (l. 34–46), com emoji;
  - novo formato: `## Documentação disponível` → `### Plataforma iHealth` e `### Extração de Dados Clínicos`, cada um com uma frase de descrição, lista curta de destaques e link "Começar →".
- [x] Descrição da Extração: remover "Dados organizados com terminologias médicas padronizadas" (l. 43), que não vale mais (3.5).
- [x] Link de acesso à Plataforma (`https://plataforma.ihealthgroup.tec.br/`) no card da Plataforma.
- [x] Contato (l. 57): manter `https://ihealthgroup.com.br` (sem `www`).
- [x] Rodapé (`docusaurus.config.js`):
  - trocar `https://www.ihealthgroup.com.br/` por `https://ihealthgroup.com.br/` (l. 107);
  - adicionar o link de acesso à Plataforma na coluna "iHealth" (ex.: "Acessar a Plataforma").
- [x] Textos institucionais (Sobre, Missão, Data Lake, Valores): revisar só a linguagem, sem mudar as informações (D11).

### 5.2 Extração de Dados Clínicos

#### 5.2.1 Criar a v1 (antes de qualquer edição de conteúdo)

- [x] Copiar as 7 páginas para `docs/clinical-data-extraction/v1/`.
- [x] Em cada página da v1, adicionar frontmatter:
  ```yaml
  ---
  displayed_sidebar: docsSidebar
  pagination_prev: clinical-data-extraction/v1/<anterior>
  pagination_next: clinical-data-extraction/v1/<próxima>
  ---
  ```
- [x] Adicionar aviso no topo de cada página da v1 (`:::caution Documentação v1`): "Esta documentação corresponde às extrações entregues até 20/09/2026. Consulte a versão atual", com link para a página equivalente da v2.
- [x] Navegação da v1 pela paginação nativa do Docusaurus (Anterior à esquerda, Próximo à direita), via `pagination_prev`/`pagination_next` no frontmatter, na ordem: intro → data-structure → csv-format → jsonl-format → delivery → analysis-guidelines → limitations. Links manuais removidos.
- [x] Confirmar que `sidebars.js` **não** referencia nada de `v1/`.
- [x] Corrigir erros nos exemplos da v1 (sem alterar o schema):
  - `csv-format`: linhas do HER2 e das plaquetas com colunas desalinhadas (o LOINC caía em `unit`);
  - `delivery`: `split('_')[1]` → número do lote; `import glob` nos exemplos 2 e 3;
  - `analysis-guidelines`: campos vazios lidos como NaN pelo pandas (função `preenchido`); comorbidades só com `DISEASE` + `PRESENTE`; "Documentos sem entidades"; "Entidades sem assertion" só nas categorias com assertion; relações órfãs; gráfico de séries temporais com índice `Period`;
  - `jsonl-format`: comorbidades só com `DISEASE` + `PRESENTE`;
  - `limitations`: typo "estrututurados", linha `RELATIONS` da tabela, contato interno (issue/equipe de desenvolvimento) trocado pelo e-mail, navegação duplicada no fim.
- [x] Padronizar exemplos inconsistentes da v1:
  - `relation_position` = posição da **entidade da linha** na relação (como no exemplo do `csv-format`); corrigida a comparação CSV × JSONL e a descrição em `data-structure`;
  - `detection_status` padronizado como `POS` (HER2); resultados numéricos ficam com `detection_status` vazio (removido `normal`);
  - LOINC: HER2 `48676-1`, KI67 `29593-1` (antes os dois usavam `33747-0`), validados (Q22);
  - "Última atualização: Setembro 2026" em `limitations`.

#### 5.2.2 Atualizar a v2 (páginas atuais)

**Transversal (todas as páginas)**

- [x] Remover os links manuais Anterior/Próximo. O Docusaurus já gera a paginação a partir do menu, e os links atuais estão fora de ordem.
- [x] Padronizar a abertura de cada página (uma frase de propósito + para quem é), no estilo da Plataforma.
- [x] Nomes de categorias e contextos: valor técnico do arquivo + nome em português igual ao da Plataforma (tabelas 3.1 e 3.2).
- [x] Sem menções à v1 ou a "o que mudou" (D8), exceto o card da intro.
- [x] Varrer todas as páginas por: `CLINICAL_ATT`, `vital_signs`, `SYMPTOM`, `VENT_SUPPORT`, `condition`, `loinc_code`, `terminology`, `term_code`, `term_desc`, `el`, `CID-10`, `ATC`, `TUSS`, `PRESENTE`, `AUSENTE`, `POSSIVEL`, `HISTORICO`.

**`intro.md`**

- [x] Card para a v1 (`:::info`): "Recebeu sua extração antes de 21/09/2026? Consulte a documentação da versão anterior →".
- [x] Formatos e lotes (l. 17–35): conteúdo mantido (D12); revisar só a linguagem.
- [x] Remover "terminologias" da lista de benefícios, se houver menção.

**`data-structure.md`** — página com mais mudanças

- [x] `assertion`: tabela de campos (l. 77), tabela de valores (l. 117–122), exemplo (l. 135–143) e lista "Importância" (l. 126–131) com os valores e significados de 3.1, incluindo `OTHER` e `FAMILY_HISTORY` no exemplo prático.
- [x] "Categorias com asserção" (l. 147–151): lista de 3.1 (mesmas da Plataforma).
- [x] **Remover** a seção "Campos de Terminologia" (l. 79–85) e "Campos de Terminologia – Normalização e Codificação" (l. 153–176).
- [x] Campos estruturados (l. 95–107): substituir pela tabela de 3.4 (só `BIOMARKER` e `LAB_TEST`; sem `condition` e `loinc_code`; `method` em ambos; `score` só em `BIOMARKER`).
- [x] Lista de labels (l. 180–201): substituir pela tabela 3.2.
- [x] Tipos de relação (l. 203–217): substituir pela lista 3.3, com descrição e exemplo. Descrições e exemplos validados por produto (Q12).
- [x] `payer_name` (l. 26–34): mantido; revisar só a linguagem.

**`csv-format.md`**

- [x] Cabeçalho (l. 14): conforme 3.6.
- [x] Exemplos (l. 20–24): refazer sem terminologia/LOINC, com valores novos de `assertion`, e incluir uma linha com `method`/`score`.
- [x] Código de análise numérica (l. 92): remover `CLINICAL_ATT`.

**`jsonl-format.md`**

- [x] Remover `vital_signs` em todas as ocorrências (l. 32, 52–59, 68, 151–178, 270–286, 314, 321).
- [x] Remover o objeto `el` (l. 44–50, 80–84, 225–228) e `loinc_code` (l. 99, 112, 241, 339).
- [x] Objeto `result` (l. 52–59): remover `condition`; incluir `score` (só biomarcador). `method` entra no nível da entidade em `biomarkers` e `lab_tests` (3.7).
- [x] Exemplos e código de `biomarkers` (l. 89–120, 232–250, 328–351): incluir `method` e `result.score`.
- [x] Exemplos e código de `lab_tests` (l. 122–149, 252–268): incluir `method`.
- [x] Atualizar `assertion` nos exemplos (`PRESENTE` → `PRESENT`).
- [x] Atualizar a relação do exemplo (`disease_has_finding`, l. 185, 405, 416–417), que saiu da lista.

**`delivery.md`**

- [x] Lote, nomenclatura e locais de entrega: conteúdo mantido (D12).
- [x] Corrigir bugs nos exemplos:
  - `file_path.split('_')[1]` retorna `"patients"`, não o número do lote (l. 104, 127);
  - o exemplo paralelo usa `glob` sem importar (l. 108).
- [x] Revisar os demais exemplos de código (l. 178–273) em busca de erros, sem remover seções (D10).

**`analysis-guidelines.md`**

- [x] Remover `CLINICAL_ATT` do código (l. 176).
- [x] Remover a verificação de cobertura de terminologia (l. 249–255).
- [x] Revisar a lista de valores ausentes (l. 63: "Códigos de terminologia").
- [x] Revisar os exemplos de código em busca de erros, sem remover seções (D10). Pontos já vistos:
  - "Análise de Comorbidades" (l. 200–203) usa todas as entidades, não só `DISEASE`;
  - "Documentos sem entidades" (l. 278–281) nunca encontra nada, porque `groupby().size()` não gera grupos vazios;
  - "Entidades sem assertion" (l. 283–285) deve considerar só as labels com `assertion` (3.1).

**`limitations.md`**

- [x] Tabela por categoria (l. 31–37): trocar `SYMPTOM` por `FINDING` e remover `RELATIONS`, que não é categoria.
- [x] Revisar a menção a "Diferentes sistemas de codificação médica" (l. 87), já que não há mais terminologia.
- [x] Corrigir o erro de digitação "estrututurados" (l. 13).
- [x] Remover o conteúdo interno/inadequado para cliente: "Abra uma issue no repositório", "Equipe de Desenvolvimento" (l. 181–186) e "Última atualização: Setembro 2025 / Versão 1.0" (l. 195–196).

**Decisões tomadas na implementação (validadas por produto: Q20–Q23)**

- Os valores de exemplo de `method` (`imuno-histoquímica`) e `detection_status` (`POS`) e o `score` `3+` do HER2 são ilustrativos. Confirmar com produto os valores reais desses campos.
- O nome "Conceito temporal" para `TEMPORAL_CONCEPT` e "Outro" para `OTHER` foram criados por nós, pois essas categorias não existem na Plataforma.
- A verificação de cobertura de terminologia em `analysis-guidelines` foi substituída por uma verificação de preenchimento dos campos estruturados (mantém a seção, D10).

### 5.3 Repositório

- [x] `README.md`: incluir a pasta `v1/` na árvore, explicar a convenção (fora do menu lateral, temporária) e corrigir a ordem das seções da Extração (l. 74–80), que hoje difere do menu.

### 5.4 Publicação

- [x] `npm run build` sem erros (o `onBrokenLinks: "throw"` valida os links da v1 e da v2).
- [ ] `npm run deploy` (fora desta etapa; feito no fluxo normal de publicação).
- [ ] Conferir no site publicado: Bem-vindo, uma página da v2, uma página da v1 (menu, rodapé, aviso, card).

## 6. Fora de escopo

- Página da Plataforma (`docs/plataforma/boas-vindas.md`): já atualizada. Serve só de referência de terminologia.
- Navegação/menu (item 3 da issue): problema inexistente (Q9).
- Versionamento nativo do Docusaurus / instância separada do plugin de docs (D5).
- Seção "o que mudou" na Extração (D8).
- Mudanças de visual/tema.

## 7. Ordem de execução

1. **5.2.1** — criar a v1 (congela o estado atual).
2. **5.2.2** — conteúdo da v2 com o schema da seção 3, incluindo correções de código.
3. ~~Redigir as descrições das relações (3.3) e enviar para validação de produto (Q12).~~ Concluído.
4. **5.1** — Bem-vindo e rodapé.
5. **5.3** — README.
6. **5.4** — build, deploy e verificação (Q12 já validada).

## 8. Critérios de aceite (reescritos)

- [ ] Bem-vindo apresenta **Plataforma e Extração no mesmo nível e formato**, com contatos atualizados (D9).
- [ ] Extração **v2** documenta o schema vigente (seção 3), sem terminologia, sinais vitais nem valores antigos, com nomes consistentes com a Plataforma.
- [ ] Extração **v1** acessível pelo card na v2, fora do menu lateral, com aviso de versão desatualizada em todas as páginas.
- [ ] Build sem links quebrados e deploy realizado.
