---
displayed_sidebar: docsSidebar
pagination_prev: clinical-data-extraction/v1/intro
pagination_next: clinical-data-extraction/v1/csv-format
---

# Data Structure

:::caution v1 documentation
This documentation covers extractions delivered **up to September 20, 2026**. See the [current version](/clinical-data-extraction/data-structure).
:::

## Overview {#visão-geral}

The data extracted from our clinical database is organized in two main sections:

1. **Metadata Fields** - Information about the patient and the document (anonymized)
2. **Clinical Entity Fields** - Structured data extracted from the medical documents

> **Note**: this data is a specific selection from our clinical database, with broad national coverage and good representativeness for studies, filtered according to criteria defined by the contracting client.

> **Language of the data**: entity values, `assertion` values, `term_desc` and `provider_type` values are in Portuguese, as in the delivered files. The examples below keep them in Portuguese, with an English translation in italics where helpful.

## Patient and Document Metadata Fields {#campos-de-metadados-do-paciente-e-do-documento}

| Field                 | Type   | Description                                                                              |
| --------------------- | ------ | ---------------------------------------------------------------------------------------- |
| `document_id`         | string | Unique identifier of the document in the database                                        |
| `document_date`       | string | Creation date of the clinical document (YYYY-MM-DD HH:MM:SS)                             |
| `patient_id`          | string | Anonymized patient ID (prefix: "patient")                                                |
| `case_id`             | string | Anonymized clinical case ID (prefix: "case")                                             |
| `gender`              | string | Patient's biological sex (MALE, FEMALE, UNKNOWN). [See details below](#campo-gender).    |
| `birthdate`           | string | Patient's date of birth (YYYY-MM-DD HH:MM:SS)                                            |
| `death`               | string | Patient's death status (Y, N, X). [See details below](#campo-death).                     |
| `provider_state_code` | string | Code of the provider's Brazilian state (UF)                                              |
| `provider_type`       | string | Hospital type (Público, Convênio, Particular). [See details below](#campo-provider-type). |

## Additional Fields {#campos-adicionais}

The fields below can be contracted as an add-on when purchasing the database.

| Field        | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `payer_name` | string | Identifier of the payer associated with the clinical note. The same patient or encounter may have multiple payers, depending on the services recorded. A non-normalized string field that represents various health plans/insurers, SUS (Brazil's public health system) or private payment, and may contain spelling variations for the same payer, which requires normalization before analysis. |

> **Important**: check with the sales team during negotiations to include this field.

### Field Details {#detalhamento-dos-campos}

#### death field – Death Status {#campo-death}

The `death` field indicates whether the patient has a death record in the database.

| Value | Description                                                                         |
| ----- | ----------------------------------------------------------------------------------- |
| `Y`   | **Yes** – Death recorded                                                            |
| `N`   | **No** – No death record                                                            |
| `X`   | **Not specified / Unavailable** – Information is missing or could not be determined |

#### gender field – Patient's Biological Sex {#campo-gender}

The `gender` field represents the patient's biological sex, as recorded in the clinical documents.

| Value     | Description                                                                         |
| --------- | ----------------------------------------------------------------------------------- |
| `MALE`    | **Male**                                                                            |
| `FEMALE`  | **Female**                                                                          |
| `UNKNOWN` | **Not specified / Unavailable** – Information is missing or could not be determined |

#### provider_type field – Hospital Type {#campo-provider-type}

The `provider_type` field classifies the provider by type of management and payer. The values are in Portuguese.

| Value                             | Meaning                      | Description                                                                                                        |
| --------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Público`                         | Public                       | Facility exclusively in the public health network (SUS or equivalent). Care funded by the government.              |
| `Convênio ou Particular`          | Insurance or private         | Facility that serves patients through health plans/insurance and/or private (self-pay) care, with no public care. |
| `Público, Convênio ou Particular` | Public, insurance or private | Facility that offers care in all three modalities (public, insurance and private).                                 |

## Clinical Entity Fields {#campos-de-entidades-clínicas}

### Basic Entity Fields {#campos-básicos-da-entidade}

| Field       | Type   | Description                                                                                       |
| ----------- | ------ | ------------------------------------------------------------------------------------------------- |
| `entity_id` | string | Unique entity ID (document_id + position)                                                         |
| `entity`    | string | Clinical term extracted from the text                                                             |
| `label`     | string | Category of the clinical entity                                                                   |
| `assertion` | string | Assertion about the entity's context (AUSENTE, PRESENTE, POSSIVEL, HISTORICO) (when available)    |

### Terminology Fields (when available) {#campos-de-terminologia-quando-disponível}

| Field         | Type   | Description                                                   |
| ------------- | ------ | ------------------------------------------------------------- |
| `terminology` | string | Terminology used (CID-10, the Brazilian ICD-10; ATC; TUSS)    |
| `term_code`   | string | Terminology code                                              |
| `term_desc`   | string | Term description (in Portuguese)                              |

### Relation Fields (when applicable) {#campos-de-relação-quando-aplicável}

| Field               | Type   | Description                                           |
| ------------------- | ------ | ----------------------------------------------------- |
| `relation_type`     | string | Type of relation with another entity                  |
| `relation_entity`   | string | Related entity                                        |
| `relation_position` | string | Position of the row's entity in the relation (head, tail) |

## Structured Fields for Lab Tests and Biomarkers {#campos-estruturados-para-exames-e-biomarcadores}

**Important**: the fields below are filled in only when the entity could be normalized/structured, and they apply only to the categories listed:

| Field               | Type   | Applicable Categories             | Description                                                    |
| ------------------- | ------ | --------------------------------- | -------------------------------------------------------------- |
| `normalized_entity` | string | BIOMARKER, LAB_TEST, CLINICAL_ATT | Standardized version of the entity (when normalization was possible) |
| `numeric_value`     | number | BIOMARKER, LAB_TEST, CLINICAL_ATT | Extracted numeric value                                        |
| `unit`              | string | BIOMARKER, LAB_TEST, CLINICAL_ATT | Unit of measurement (when available)                           |
| `specific_marker`   | string | BIOMARKER, LAB_TEST, CLINICAL_ATT | Specific result marker                                         |
| `detection_status`  | string | BIOMARKER, LAB_TEST               | Detection status of the result                                 |
| `condition`         | string | CLINICAL_ATT                      | Associated conditions                                          |
| `loinc_code`        | string | BIOMARKER                         | LOINC code (when available)                                    |

## Details and Additional Information {#detalhamentos-e-informações-adicionais}

### Assertion Field - Entity Context {#campo-de-asserção---contexto-das-entidades}

The `assertion` field is an important classification that indicates the **clinical context** in which an entity was mentioned in the medical document. This information is crucial for accurate analyses, because the same clinical term can mean different things depending on the context.

#### Possible Assertion Values {#valores-possíveis-de-asserção}

In v1, the `assertion` values are in Portuguese, exactly as below.

| Value       | Meaning  | Description                                     | Usage Example                                                                                    |
| ----------- | -------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `PRESENTE`  | Present  | The entity is **confirmed** in the patient      | "Paciente apresenta diabetes tipo 2" (_patient has type 2 diabetes_)                             |
| `AUSENTE`   | Absent   | The entity is **negated** or **absent**         | "Paciente não apresenta hipertensão" (_patient does not have hypertension_)                      |
| `POSSIVEL`  | Possible | The entity is **suspected** or **possible**     | "Suspeita de pneumonia" (_suspected pneumonia_) or "Possível infarto" (_possible infarction_)    |
| `HISTORICO` | History  | The entity is part of the patient's **history** | "Histórico de cirurgia cardíaca em 2020" (_history of heart surgery in 2020_)                    |

#### Why It Matters for Data Analysis {#importância-para-análise-de-dados}

Assertion is essential for accurate analyses because it:

- **Avoids false positives**: negated entities (`AUSENTE`) should not be counted as present
- **Identifies suspicions**: `POSSIVEL` entities may indicate cases under investigation
- **Puts history in context**: `HISTORICO` entities provide information about the patient's past
- **Improves precision**: allows more refined analyses that take the clinical context into account

#### Practical Example {#exemplo-prático}

```text
Text: "Paciente nega diabetes, mas apresenta histórico de hipertensão.
Suspeita de insuficiência cardíaca."
(Patient denies diabetes, but has a history of hypertension.
Suspected heart failure.)

Extracted entities:
- "diabetes" → assertion: AUSENTE
- "hipertensão" → assertion: HISTORICO
- "insuficiência cardíaca" → assertion: POSSIVEL
```

#### Categories with Assertion {#categorias-com-asserção}

The assertion inference model is applied only to the following entity categories:

**DISEASE**, **PROCEDURE**, **PHARM_SUBSTANCE**, **SYMPTOM**, **FINDING**, **INJURY**, **VENT_SUPPORT**, **MEDICAL_DEVICE**.

In the other categories (for example, BIOMARKER, LAB_TEST, CLINICAL_ATT, BODY_PART, TEMPORAL_CONCEPT, among others), the inference model **is not applied**. These entities are treated as naturally present in the clinical context of the document and do not need additional classification. So an empty field does not indicate an inference failure.

### Terminology Fields - Normalization and Coding {#campos-de-terminologia---normalização-e-codificação}

The terminology fields (`terminology`, `term_code`, `term_desc`) apply only to **3 specific entity categories**, when the entity could be mapped/normalized to standardized medical terminologies.

#### Categories with Terminology {#categorias-com-terminologia}

| Category          | Terminology | Description                                                                         | Example                                                    |
| ----------------- | ----------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `DISEASE`         | **CID-10**  | International Classification of Diseases (ICD-10, Brazilian Portuguese edition)    | "diabetes tipo 2" (_type 2 diabetes_) → CID-10: E11        |
| `PROCEDURE`       | **TUSS**    | Unified Terminology for Supplementary Health (Brazilian procedure terminology)      | "cirurgia cardíaca" (_heart surgery_) → TUSS: 31001001     |
| `PHARM_SUBSTANCE` | **ATC**     | Anatomical Therapeutic Chemical                                                     | "metformina" (_metformin_) → ATC: A10BA02                  |

#### Practical Example {#exemplo-prático-1}

```text
Extracted entity: "diabetes mellitus tipo 2"
Category: DISEASE
Terminology applied:
- terminology: "CID-10"
- term_code: "E11"
- term_desc: "Diabetes mellitus não-insulino-dependente"
  (Non-insulin-dependent diabetes mellitus)
```

> **Important**: not every entity in the `DISEASE`, `PROCEDURE` and `PHARM_SUBSTANCE` categories will have terminology fields filled in. They are filled in only when the entity could be mapped automatically to the standardized terminologies.

### Clinical Entity Categories {#categorias-de-entidades-clínicas}

#### Available Labels {#labels-disponíveis}

| Label              | Description                  | Example                                                             |
| ------------------ | ---------------------------- | ------------------------------------------------------------------- |
| `DISEASE`          | Diseases and medical conditions | "diabetes", "hipertensão" (_hypertension_)                       |
| `FINDING`          | Observed clinical findings   | "edema", "icterícia" (_jaundice_)                                   |
| `SYMPTOM`          | Signs and symptoms           | "dor" (_pain_), "febre" (_fever_)                                   |
| `PHARM_SUBSTANCE`  | Pharmacological substances   | "metformina" (_metformin_), "insulina" (_insulin_)                  |
| `PROCEDURE`        | Medical procedures           | "cirurgia" (_surgery_), "biópsia" (_biopsy_)                        |
| `STAGE`            | Progression stages           | "estágio 3" (_stage 3_), "avançado" (_advanced_)                    |
| `SCALE`            | Clinical scales              | "Glasgow", "APACHE"                                                 |
| `VENT_SUPPORT`     | Respiratory support          | "ventilação mecânica" (_mechanical ventilation_)                    |
| `MEDICAL_DEVICE`   | Medical devices              | "cateter" (_catheter_), "marca-passo" (_pacemaker_)                 |
| `INJURY`           | Injuries and trauma          | "fratura" (_fracture_), "laceração" (_laceration_)                  |
| `HCARE_ACTIVITY`   | Care activities              | "fisioterapia" (_physical therapy_), "enfermagem" (_nursing_)       |
| `TEMPORAL_CONCEPT` | Temporal concepts            | "ontem" (_yesterday_), "crônico" (_chronic_)                        |
| `BODY_PART`        | Anatomical parts             | "coração" (_heart_), "fígado" (_liver_)                             |
| `BODY_LOC`         | Specific locations           | "ventrículo esquerdo" (_left ventricle_)                            |
| `MORPHOLOGY`       | Morphological characteristics | "hiperplasia" (_hyperplasia_), "atrofia" (_atrophy_)               |
| `BIOMARKER`        | Biomarkers                   | "hemoglobina" (_hemoglobin_), "glicose" (_glucose_)                 |
| `LAB_TEST`         | Lab tests                    | "hemograma" (_complete blood count_), "urina" (_urinalysis_)        |
| `CLINICAL_ATT`     | Vital signs                  | "pressão arterial" (_blood pressure_), "temperatura" (_temperature_) |

### Relation Types {#tipos-de-relação}

| Relation Type                          | Description                                  | Example                                                   |
| -------------------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| `is_date_of`                           | Associates a date with an event              | "15/01/2024" → "cirurgia" (_surgery_)                     |
| `is_associated_anatomic_site_of`       | Links an entity to an anatomic site          | "tumor" → "fígado" (_liver_)                              |
| `may_treat`                            | Indicates a possible treatment               | "metformina" (_metformin_) → "diabetes"                   |
| `procedure_has_target_anatomy`         | Defines the anatomic target of a procedure   | "biópsia" (_biopsy_) → "fígado" (_liver_)                 |
| `is_qualifier_of`                      | Qualifies or modifies an entity              | "agudo" (_acute_) → "infarto" (_infarction_)              |
| `may_diagnose`                         | Indicates diagnostic capability              | "tomografia" (_CT scan_) → "tumor"                        |
| `disease_has_primary_anatomic_site`    | Links a disease to its primary site          | "hepatite" (_hepatitis_) → "fígado" (_liver_)             |
| `induced_by`                           | Links an entity to its causative factor      | "úlcera" (_ulcer_) → "AINEs" (_NSAIDs_)                   |
| `disease_has_finding`                  | Associates a disease with a finding          | "diabetes" → "poliúria" (_polyuria_)                      |
| `disease_has_metastatic_anatomic_site` | Defines a metastatic site                    | "câncer" (_cancer_) → "pulmão" (_lung_)                   |
| `disease_has_associated_anatomic_site` | Links a disease to an associated site        | "pneumonia" → "pulmão" (_lung_)                           |

> **Important**: the data extraction delivered contains only the patients and documents that meet the specific criteria defined for the project, a selected sample of our database with broad coverage and representativeness.
