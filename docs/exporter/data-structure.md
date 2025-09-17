# Estrutura dos Dados

## Visão Geral

Os dados extraídos de nosso banco clínico são organizados em duas seções principais:

1. **Campos de Identificação** - Informações sobre paciente e documento (anonimizadas)
2. **Campos de Entidades Clínicas** - Dados estruturados extraídos dos documentos médicos

> **Nota**: Estes dados representam uma seleção específica de nosso banco de dados clínico, composto por mais de 45 milhões de documentos de aproximadamente 2,7 milhões de pacientes de 31 hospitais brasileiros, filtrados conforme critérios definidos pelo cliente contratante.

## Campos de Identificação do Paciente e Documento

| Campo                 | Tipo   | Descrição                                                  |
| --------------------- | ------ | ---------------------------------------------------------- |
| `document_id`         | string | Identificador único do documento no banco de dados         |
| `document_date`       | string | Data de criação do documento clínico (YYYY-MM-DD HH:MM:SS) |
| `patient_id`          | string | ID anonimizado do paciente (prefixo: "patient\_")          |
| `case_id`             | string | ID anonimizado do caso clínico (prefixo: "case\_")         |
| `gender`              | string | Gênero do paciente (MALE, FEMALE, UNKNOWN)                 |
| `birthdate`           | string | Data de nascimento do paciente (YYYY-MM-DD HH:MM:SS)       |
| `death`               | string | Status de óbito (Y, N, X)                                  |
| `provider`            | string | Nome do provedor de dados (anonimizado ou completo)        |
| `provider_state_code` | string | Código da Unidade Federativa do provedor                   |
| `provider_city`       | string | Cidade do provedor                                         |
| `provider_type`       | string | Tipo de hospital (Público, Convênio, Particular)           |

## Campos de Entidades Clínicas

### Campos Básicos da Entidade

| Campo       | Tipo   | Descrição                                                                                         |
| ----------- | ------ | ------------------------------------------------------------------------------------------------- |
| `entity_id` | string | ID único da entidade (document_id + posição)                                                      |
| `entity`    | string | Termo clínico extraído do texto                                                                   |
| `label`     | string | Categoria da entidade clínica                                                                     |
| `assertion` | string | Aserção sobre o contexto da entidade (AUSENTE, PRESENTE, POSSIVEL, HISTORICO) (quando disponível) |

### Campos de Terminologia (quando disponível)

| Campo         | Tipo   | Descrição                                  |
| ------------- | ------ | ------------------------------------------ |
| `terminology` | string | Terminologia utilizada (CID-10, ATC, TUSS) |
| `term_code`   | string | Código da terminologia                     |
| `term_desc`   | string | Descrição do termo                         |

### Campos de Relação (quando aplicável)

| Campo               | Tipo   | Descrição                          |
| ------------------- | ------ | ---------------------------------- |
| `relation_type`     | string | Tipo de relação com outra entidade |
| `relation_entity`   | string | Entidade relacionada               |
| `relation_position` | string | Posição na relação (head, tail)    |

## Campos Estruturados para Exames e Biomarcadores

**Importante**: Os campos abaixo são preenchidos apenas quando foi possível fazer a normalização/estruturação da entidade e se aplicam apenas às categorias especificadas:

| Campo               | Tipo   | Categorias Aplicáveis             | Descrição                                                         |
| ------------------- | ------ | --------------------------------- | ----------------------------------------------------------------- |
| `normalized_entity` | string | BIOMARKER, LAB_TEST, CLINICAL_ATT | Versão padronizada da entidade (quando normalização foi possível) |
| `numeric_value`     | string | BIOMARKER, LAB_TEST, CLINICAL_ATT | Valor numérico extraído (quando disponível)                       |
| `unit`              | string | BIOMARKER, LAB_TEST, CLINICAL_ATT | Unidade de medida (quando disponível)                             |
| `specific_marker`   | string | BIOMARKER, LAB_TEST, CLINICAL_ATT | Marcador específico de resultado                                  |
| `detection_status`  | string | BIOMARKER, LAB_TEST               | Status de detecção do resultado                                   |
| `condition`         | string | CLINICAL_ATT                      | Condições associadas                                              |
| `loinc_code`        | string | BIOMARKER                         | Código LOINC (quando disponível)                                  |

## Detalhamentos e Informações Adicionais

### Campo de Asserção - Contexto das Entidades

O campo `assertion` é uma classificação importante que indica o **contexto clínico** em que uma entidade foi mencionada no documento médico. Esta informação é crucial para análises precisas, pois o mesmo termo clínico pode ter significados diferentes dependendo do contexto.

#### Valores Possíveis de Asserção

| Valor       | Descrição                                  | Exemplo de Uso                                |
| ----------- | ------------------------------------------ | --------------------------------------------- |
| `PRESENTE`  | A entidade está **confirmada** no paciente | "Paciente apresenta diabetes tipo 2"          |
| `AUSENTE`   | A entidade está **negada** ou **ausente**  | "Paciente não apresenta hipertensão"          |
| `POSSIVEL`  | A entidade é **suspeita** ou **possível**  | "Suspeita de pneumonia" ou "Possível infarto" |
| `HISTORICO` | A entidade é um **histórico** do paciente  | "Histórico de cirurgia cardíaca em 2020"      |

#### Importância para Análise de Dados

A asserção é fundamental para análises precisas porque:

- **Evita falsos positivos**: Entidades negadas (`AUSENTE`) não devem ser contadas como presentes
- **Identifica suspeitas**: Entidades `POSSIVEL` podem indicar casos em investigação
- **Contextualiza histórico**: Entidades `HISTORICO` fornecem informações sobre o passado do paciente
- **Melhora precisão**: Permite análises mais refinadas considerando o contexto clínico

#### Exemplo Prático

```text
Texto: "Paciente nega diabetes, mas apresenta histórico de hipertensão.
Suspeita de insuficiência cardíaca."

Entidades extraídas:
- "diabetes" → assertion: AUSENTE
- "hipertensão" → assertion: HISTORICO
- "insuficiência cardíaca" → assertion: POSSIVEL
```

> **Nota**: O campo `assertion` está disponível apenas para algumas categorias de entidades e nem todos os documentos podem ter esta classificação aplicada.

### Campos de Terminologia - Normalização e Codificação

Os campos de terminologia (`terminology`, `term_code`, `term_desc`) são aplicados apenas para **3 categorias específicas** de entidades, quando foi possível fazer o mapeamento/normalização para terminologias médicas padronizadas.

#### Categorias com Terminologia

| Categoria         | Terminologia | Descrição                                   | Exemplo                              |
| ----------------- | ------------ | ------------------------------------------- | ------------------------------------ |
| `DISEASE`         | **CID-10**   | Classificação Internacional de Doenças      | "diabetes tipo 2" → CID-10: E11      |
| `PROCEDURE`       | **TUSS**     | Terminologia Unificada da Saúde Suplementar | "cirurgia cardíaca" → TUSS: 31001001 |
| `PHARM_SUBSTANCE` | **ATC**      | Anatomical Therapeutic Chemical             | "metformina" → ATC: A10BA02          |

#### Exemplo Prático

```text
Entidade extraída: "diabetes mellitus tipo 2"
Categoria: DISEASE
Terminologia aplicada:
- terminology: "CID-10"
- term_code: "E11"
- term_desc: "Diabetes mellitus não-insulino-dependente"
```

> **Importante**: Nem todas as entidades das categorias `DISEASE`, `PROCEDURE` e `PHARM_SUBSTANCE` terão campos de terminologia preenchidos. Isso ocorre apenas quando foi possível fazer o mapeamento automático para as terminologias padronizadas.

### Categorias de Entidades Clínicas

#### Labels Disponíveis

| Label              | Descrição                    | Exemplo                           |
| ------------------ | ---------------------------- | --------------------------------- |
| `DISEASE`          | Doenças e condições médicas  | "diabetes", "hipertensão"         |
| `FINDING`          | Achados clínicos observados  | "edema", "icterícia"              |
| `SYMPTOM`          | Sinais e sintomas            | "dor", "febre"                    |
| `PHARM_SUBSTANCE`  | Substâncias farmacológicas   | "metformina", "insulina"          |
| `PROCEDURE`        | Procedimentos médicos        | "cirurgia", "biópsia"             |
| `STAGE`            | Estágios de progressão       | "estágio 3", "avançado"           |
| `SCALE`            | Escalas clínicas             | "Glasgow", "APACHE"               |
| `VENT_SUPPORT`     | Suporte respiratório         | "ventilação mecânica"             |
| `MEDICAL_DEVICE`   | Dispositivos médicos         | "cateter", "marca-passo"          |
| `INJURY`           | Lesões e traumas             | "fratura", "laceração"            |
| `HCARE_ACTIVITY`   | Atividades assistenciais     | "fisioterapia", "enfermagem"      |
| `TEMPORAL_CONCEPT` | Conceitos temporais          | "ontem", "crônico"                |
| `BODY_PART`        | Partes anatômicas            | "coração", "fígado"               |
| `BODY_LOC`         | Localizações específicas     | "ventrículo esquerdo"             |
| `MORPHOLOGY`       | Características morfológicas | "hiperplasia", "atrofia"          |
| `BIOMARKER`        | Biomarcadores                | "hemoglobina", "glicose"          |
| `LAB_TEST`         | Exames laboratoriais         | "hemograma", "urina"              |
| `CLINICAL_ATT`     | Sinais vitais                | "pressão arterial", "temperatura" |

### Tipos de Relação

| Relation Type                          | Descrição                             | Exemplo                   |
| -------------------------------------- | ------------------------------------- | ------------------------- |
| `is_date_of`                           | Associa data a evento                 | "15/01/2024" → "cirurgia" |
| `is_associated_anatomic_site_of`       | Relaciona entidade a local anatômico  | "tumor" → "fígado"        |
| `may_treat`                            | Indica tratamento possível            | "metformina" → "diabetes" |
| `procedure_has_target_anatomy`         | Define alvo anatômico de procedimento | "biópsia" → "fígado"      |
| `is_qualifier_of`                      | Qualifica ou modifica entidade        | "agudo" → "infarto"       |
| `may_diagnose`                         | Indica capacidade diagnóstica         | "tomografia" → "tumor"    |
| `disease_has_primary_anatomic_site`    | Relaciona doença ao local primário    | "hepatite" → "fígado"     |
| `induced_by`                           | Liga entidade ao fator causador       | "úlcera" → "AINEs"        |
| `disease_has_finding`                  | Associa doença a achado               | "diabetes" → "poliúria"   |
| `disease_has_metastatic_anatomic_site` | Define local metastático              | "câncer" → "pulmão"       |
| `disease_has_associated_anatomic_site` | Relaciona doença a local associado    | "pneumonia" → "pulmão"    |

## Provedores Disponíveis

Nossa base de dados clínica inclui dados de 31 provedores (hospitais) distribuídos por todas as regiões do Brasil, totalizando aproximadamente 2,7 milhões de vidas e mais de 45 milhões de documentos:

- **Sudeste**: 12 provedores (SP, MG)
- **Nordeste**: 6 provedores (PE, RN, CE, PB)
- **Sul**: 8 provedores (RS, PR, SC)
- **Norte**: 3 provedores (TO, RO)
- **Centro-Oeste**: 2 provedores (MT)

> **Importante**: A extração de dados disponibilizada contém apenas os pacientes e documentos que atendem aos critérios específicos definidos para o projeto, representando uma amostra selecionada desta base completa.

---

**Próximo**: [Formato CSV](./csv-format.md)
