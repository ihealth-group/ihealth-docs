# Estrutura dos Dados

Esta página descreve todos os campos da extração: o que cada um significa, quais valores pode assumir e a quais categorias se aplica. É a referência para quem vai carregar, validar ou analisar os dados.

## Visão Geral

Os dados extraídos do nosso banco clínico são organizados em duas partes:

1. **Campos de metadados**: informações sobre o paciente e o documento (anonimizadas)
2. **Campos de entidades clínicas**: dados estruturados extraídos dos documentos médicos

> **Nota**: os dados representam uma seleção do nosso banco de dados clínico, com ampla cobertura nacional e boa representatividade para estudos, filtrada conforme os critérios definidos pelo cliente contratante.

## Campos de Metadados do Paciente e do Documento

| Campo                 | Tipo   | Descrição                                                                                      |
| --------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `document_id`         | string | Identificador único do documento no banco de dados                                             |
| `document_date`       | string | Data de criação do documento clínico (YYYY-MM-DD HH:MM:SS)                                     |
| `patient_id`          | string | ID anonimizado do paciente (prefixo: "patient")                                                |
| `case_id`             | string | ID anonimizado do caso clínico (prefixo: "case")                                               |
| `gender`              | string | Sexo biológico do paciente (MALE, FEMALE, UNKNOWN). [Ver detalhes abaixo](#campo-gender).      |
| `birthdate`           | string | Data de nascimento do paciente (YYYY-MM-DD HH:MM:SS)                                           |
| `death`               | string | Status de óbito do paciente (Y, N, X). [Ver detalhes abaixo](#campo-death).                    |
| `provider_state_code` | string | Código da Unidade Federativa do provedor                                                       |
| `provider_type`       | string | Tipo de hospital (Público, Convênio, Particular). [Ver detalhes abaixo](#campo-provider-type). |

## Campos Adicionais

Os campos abaixo podem ser contratados à parte, durante a negociação da extração.

| Campo        | Tipo   | Descrição                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `payer_name` | string | Identificador da fonte pagadora associada à nota clínica. Um mesmo paciente ou atendimento pode ter múltiplas fontes pagadoras, conforme os serviços registrados. Campo do tipo string, não normalizado, que representa diversos planos/convênios de saúde, SUS ou privado, podendo conter variações de grafia para uma mesma fonte, o que exige normalização prévia para fins analíticos. |

> **Importante**: para incluir o campo, fale com o time comercial durante a negociação.

### Detalhamento dos Campos

#### Campo death – Status de Óbito {#campo-death}

O campo `death` indica se há registro de óbito do paciente na base.

| Valor | Descrição                                                                            |
| ----- | ------------------------------------------------------------------------------------ |
| `Y`   | **Sim** – Óbito registrado                                                           |
| `N`   | **Não** – Sem registro de óbito                                                      |
| `X`   | **Não especificado / Indisponível** – Informação não consta ou não pôde ser definida |

#### Campo gender – Sexo Biológico do Paciente {#campo-gender}

O campo `gender` representa o sexo biológico do paciente, registrado nos documentos clínicos.

| Valor     | Descrição                                                                            |
| --------- | ------------------------------------------------------------------------------------ |
| `MALE`    | **Masculino**                                                                        |
| `FEMALE`  | **Feminino**                                                                         |
| `UNKNOWN` | **Não especificado / Indisponível** – Informação não consta ou não pôde ser definida |

#### Campo provider_type – Tipo de Hospital {#campo-provider-type}

O campo `provider_type` classifica o provedor quanto à natureza da gestão e da fonte pagadora.

| Valor                             | Descrição                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `Público`                         | Estabelecimento exclusivamente da rede pública de saúde (SUS ou equivalente). Atendimento financiado pelo poder público. |
| `Convênio ou Particular`          | Estabelecimento que atende por planos de saúde/convênios e/ou atendimento particular (privado), sem oferta pública.      |
| `Público, Convênio ou Particular` | Estabelecimento que oferece atendimento nas três modalidades (público, convênio e particular).                           |

## Campos de Entidades Clínicas

### Campos Básicos da Entidade

| Campo       | Tipo   | Descrição                                                                                              |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `entity_id` | string | ID único da entidade (document_id + posição)                                                           |
| `entity`    | string | Termo clínico extraído do texto                                                                        |
| `label`     | string | Categoria da entidade clínica. [Ver categorias](#categorias-de-entidades-clinicas).                    |
| `assertion` | string | Contexto em que a entidade foi mencionada (quando aplicável). [Ver valores](#campo-assertion).         |

### Campos de Relação (quando aplicável)

| Campo               | Tipo   | Descrição                                                                  |
| ------------------- | ------ | -------------------------------------------------------------------------- |
| `relation_type`     | string | Tipo de relação com outra entidade. [Ver tipos](#tipos-de-relacao).         |
| `relation_entity`   | string | A outra entidade da relação                                                |
| `relation_position` | string | Posição da entidade da linha na relação (`head` ou `tail`)                 |

## Campos Estruturados de Biomarcadores e Exames

Os campos abaixo se aplicam **apenas** às categorias `BIOMARKER` e `LAB_TEST`, e são preenchidos quando foi possível normalizar e estruturar a entidade.

| Campo               | Tipo   | `BIOMARKER` | `LAB_TEST` | Descrição                                                         |
| ------------------- | ------ | :---------: | :--------: | ----------------------------------------------------------------- |
| `normalized_entity` | string | ✓           | ✓          | Versão padronizada da entidade                                    |
| `specific_marker`   | string | ✓           | ✓          | Marcador específico do resultado                                  |
| `method`            | string | ✓           | ✓          | Método utilizado para obter o resultado                           |
| `detection_status`  | string | ✓           | ✓          | Status de detecção do resultado                                   |
| `score`             | string | ✓           |            | Escore do resultado do biomarcador                                |
| `numeric_value`     | string | ✓           | ✓          | Valor numérico extraído                                           |
| `unit`              | string | ✓           | ✓          | Unidade de medida                                                 |

No JSONL, `normalized_entity`, `specific_marker` e `method` ficam no nível da entidade, e os demais campos ficam dentro do objeto `result`. Veja [Formato JSONL](./jsonl-format.md).

## Detalhamentos e Informações Adicionais

### Campo assertion – Contexto das Entidades {#campo-assertion}

O campo `assertion` indica o **contexto clínico** em que uma entidade foi mencionada no documento. O mesmo termo pode ter significados diferentes conforme o contexto, por isso esse campo é essencial para análises precisas.

#### Valores Possíveis

| Valor            | Nome               | Descrição                                                                                                   | Exemplo                                            |
| ---------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `PRESENT`        | Presente           | Condição ativa no paciente naquele momento                                                                  | "Paciente apresenta diabetes tipo 2"               |
| `INVESTIGATION`  | Em investigação    | Hipótese, suspeita ou diagnóstico em apuração                                                               | "Suspeita de pneumonia"                            |
| `HISTORY`        | Histórico          | Esteve presente no passado e pode não estar mais ativo                                                      | "Histórico de cirurgia cardíaca em 2020"           |
| `FAMILY_HISTORY` | Histórico familiar | Refere-se a um familiar, não ao paciente                                                                    | "Mãe com câncer de mama"                           |
| `ABSENT`         | Ausente            | Termo negado no texto                                                                                       | "Paciente nega hipertensão"                        |
| `OTHER`          | Outro              | Menção fora da jornada clínica do paciente, como uma doença citada como referência, em estudo ou em documento de apoio | "Protocolo de rastreamento para câncer de colo"    |

#### Importância para Análise de Dados

- **Evita falsos positivos**: entidades negadas (`ABSENT`) não devem ser contadas como presentes
- **Separa o paciente da família**: entidades `FAMILY_HISTORY` não descrevem o próprio paciente
- **Identifica suspeitas**: entidades `INVESTIGATION` indicam casos em apuração
- **Contextualiza o histórico**: entidades `HISTORY` descrevem o passado do paciente
- **Filtra menções de referência**: entidades `OTHER` não fazem parte da jornada clínica do paciente

#### Exemplo Prático

```text
Texto: "Paciente nega diabetes, com histórico de hipertensão. Mãe com câncer de mama.
Suspeita de insuficiência cardíaca."

Entidades extraídas:
- "diabetes" → assertion: ABSENT
- "hipertensão" → assertion: HISTORY
- "câncer de mama" → assertion: FAMILY_HISTORY
- "insuficiência cardíaca" → assertion: INVESTIGATION
```

#### Categorias com Asserção

O contexto é inferido apenas para as categorias **`FINDING`**, **`INJURY`**, **`DISEASE`**, **`PHARM_SUBSTANCE`**, **`PROCEDURE`** e **`MEDICAL_DEVICE`**.

Nas demais categorias, o campo `assertion` vem vazio. Essas entidades são tratadas como presentes no contexto do documento, e o campo vazio não indica falha na inferência.

### Categorias de Entidades Clínicas {#categorias-de-entidades-clinicas}

| Label              | Nome               | Descrição                                     | Exemplo                           |
| ------------------ | ------------------ | --------------------------------------------- | --------------------------------- |
| `FINDING`          | Achado clínico     | Sintomas relatados e achados do exame físico  | "dor de cabeça", "febre", "edema" |
| `INJURY`           | Lesão              | Lesões físicas ou envenenamentos              | "fratura", "queda", "alergia"     |
| `DISEASE`          | Doença             | Condições médicas ou patológicas              | "diabetes", "hipertensão"         |
| `PHARM_SUBSTANCE`  | Fármaco            | Substâncias usadas em tratamento              | "metformina", "morfina"           |
| `PROCEDURE`        | Procedimento       | Procedimentos diagnósticos ou terapêuticos    | "tomografia", "biópsia"           |
| `STAGE`            | Estadiamento       | Estágio de uma condição                       | "EC IV", "EC IIA"                 |
| `SCALE`            | Escala             | Escalas padrão de avaliação                   | "ECOG", "Glasgow"                 |
| `MEDICAL_DEVICE`   | Dispositivo médico | Dispositivos e equipamentos usados no cuidado | "cateter venoso", "dreno"         |
| `BODY_PART`        | Parte do corpo     | Órgãos e componentes anatômicos               | "mama", "pulmão"                  |
| `TEMPORAL_CONCEPT` | Conceito temporal  | Datas e expressões de tempo                   | "15/01/2024", "há 2 anos"         |
| `BIOMARKER`        | Biomarcador        | Indicadores biológicos de saúde ou doença     | "KI67", "HER2", "PSA"             |
| `LAB_TEST`         | Exame laboratorial | Resultados de testes laboratoriais            | "hemograma", "glicemia em jejum"  |

### Tipos de Relação {#tipos-de-relacao}

Cada relação liga duas entidades: a primeira (`head`) e a segunda (`tail`), nessa ordem.

| Relation type                       | Descrição                                            | Exemplo (head → tail)                       |
| ----------------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| `is_date_of`                        | Associa uma data a um evento clínico                 | "15/01/2024" → "cirurgia"                   |
| `finding_has_anatomic_site`         | Liga um achado clínico ao local anatômico            | "edema" → "membros inferiores"              |
| `may_treat`                         | Indica que um fármaco pode tratar uma condição       | "metformina" → "diabetes"                   |
| `procedure_has_target_anatomy`      | Define o alvo anatômico de um procedimento           | "biópsia" → "fígado"                        |
| `disease_has_anatomic_site`         | Liga uma doença ao local anatômico                   | "pneumonia" → "pulmão"                      |
| `disease_has_associated_disease`    | Liga uma doença a outra doença associada             | "diabetes" → "retinopatia"                  |
| `disease_has_biomarker`             | Liga uma doença a um biomarcador                     | "câncer de mama" → "HER2"                   |
| `disease_has_scale`                 | Liga uma doença a uma escala de avaliação            | "câncer de pulmão" → "ECOG"                 |
| `disease_has_stage`                 | Liga uma doença ao estadiamento                      | "câncer de mama" → "EC IIA"                 |
| `injury_has_anatomic_site`          | Liga uma lesão ao local anatômico                    | "fratura" → "fêmur"                         |
| `procedure_has_associated_device`   | Liga um procedimento ao dispositivo utilizado        | "angioplastia" → "stent"                    |
| `medical_device_has_target_anatomy` | Define o alvo anatômico de um dispositivo médico     | "cateter venoso central" → "veia jugular"   |
| `disease_has_oncologic_finding`     | Liga uma doença oncológica a um achado oncológico    | "adenocarcinoma de pulmão" → "metástase"    |

> **Importante**: a extração contém apenas os pacientes e documentos que atendem aos critérios definidos para o projeto, representando uma amostra selecionada da nossa base, com ampla cobertura e representatividade.
