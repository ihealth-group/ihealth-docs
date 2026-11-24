# Data Structure

This page describes every field in the extraction: what each one means, which values it can take and which categories it applies to. It is the reference for anyone who will load, validate or analyze the data.

## Overview {#visão-geral}

The data extracted from our clinical database is organized in two parts:

1. **Metadata fields**: information about the patient and the document (anonymized)
2. **Clinical entity fields**: structured data extracted from the medical documents

> **Note**: the data is a selection from our clinical database, with broad national coverage and good representativeness for studies, filtered according to the criteria defined by the contracting client.

> **Language of the data**: entity values and `provider_type` values are in Portuguese, as in the source documents. The examples below keep them in Portuguese, with an English translation in italics where helpful.

## Patient and Document Metadata Fields {#campos-de-metadados-do-paciente-e-do-documento}

| Field                 | Type   | Description                                                                                  |
| --------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `document_id`         | string | Unique identifier of the document in the database                                            |
| `document_date`       | string | Creation date of the clinical document (YYYY-MM-DD HH:MM:SS)                                 |
| `patient_id`          | string | Anonymized patient ID (prefix: "patient")                                                    |
| `case_id`             | string | Anonymized clinical case ID (prefix: "case")                                                 |
| `gender`              | string | Patient's biological sex (MALE, FEMALE, UNKNOWN). [See details below](#campo-gender).        |
| `birthdate`           | string | Patient's date of birth (YYYY-MM-DD HH:MM:SS)                                                |
| `death`               | string | Patient's death status (Y, N, X). [See details below](#campo-death).                         |
| `provider_state_code` | string | Code of the provider's Brazilian state (UF)                                                  |
| `provider_type`       | string | Hospital type (Público, Convênio, Particular). [See details below](#campo-provider-type).     |

## Additional Fields {#campos-adicionais}

The fields below can be contracted separately, during the extraction negotiation.

| Field        | Type   | Description                                                                                                                                                                                                                                                                                                                              |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `payer_name` | string | Identifier of the payer associated with the clinical note. The same patient or encounter may have multiple payers, depending on the services recorded. A non-normalized string field that represents various health plans/insurers, SUS (Brazil's public health system) or private payment, and may contain spelling variations for the same payer, which requires normalization before analysis. |

> **Important**: to include this field, talk to the sales team during the negotiation.

### Field Details {#detalhamento-dos-campos}

#### death field – Death Status {#campo-death}

The `death` field indicates whether the patient has a death record in the database.

| Value | Description                                                                 |
| ----- | --------------------------------------------------------------------------- |
| `Y`   | **Yes** – Death recorded                                                    |
| `N`   | **No** – No death record                                                    |
| `X`   | **Not specified / Unavailable** – Information is missing or could not be determined |

#### gender field – Patient's Biological Sex {#campo-gender}

The `gender` field represents the patient's biological sex, as recorded in the clinical documents.

| Value     | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `MALE`    | **Male**                                                                    |
| `FEMALE`  | **Female**                                                                  |
| `UNKNOWN` | **Not specified / Unavailable** – Information is missing or could not be determined |

#### provider_type field – Hospital Type {#campo-provider-type}

The `provider_type` field classifies the provider by type of management and payer. The values are in Portuguese.

| Value                             | Meaning                                    | Description                                                                                              |
| --------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `Público`                         | Public                                     | Facility exclusively in the public health network (SUS or equivalent). Care funded by the government.    |
| `Convênio ou Particular`          | Insurance or private                       | Facility that serves patients through health plans/insurance and/or private (self-pay) care, with no public care. |
| `Público, Convênio ou Particular` | Public, insurance or private               | Facility that offers care in all three modalities (public, insurance and private).               |

## Clinical Entity Fields {#campos-de-entidades-clínicas}

### Basic Entity Fields {#campos-básicos-da-entidade}

| Field       | Type   | Description                                                                                  |
| ----------- | ------ | -------------------------------------------------------------------------------------------- |
| `entity_id` | string | Unique entity ID (document_id + position)                                                    |
| `entity`    | string | Clinical term extracted from the text                                                        |
| `label`     | string | Category of the clinical entity. [See categories](#categorias-de-entidades-clinicas).        |
| `assertion` | string | Context in which the entity was mentioned (when applicable). [See values](#campo-assertion). |

### Relation Fields (when applicable) {#campos-de-relação-quando-aplicável}

| Field               | Type   | Description                                                            |
| ------------------- | ------ | ---------------------------------------------------------------------- |
| `relation_type`     | string | Type of relation with another entity. [See types](#tipos-de-relacao).  |
| `relation_entity`   | string | The other entity in the relation                                       |
| `relation_position` | string | Position of the row's entity in the relation (`head` or `tail`)        |

## Structured Fields for Biomarkers and Lab Tests {#campos-estruturados-de-biomarcadores-e-exames}

The fields below apply **only** to the `BIOMARKER` and `LAB_TEST` categories, and are filled in when the entity could be normalized and structured.

| Field               | Type   | `BIOMARKER` | `LAB_TEST` | Description                              |
| ------------------- | ------ | :---------: | :--------: | ---------------------------------------- |
| `normalized_entity` | string |      ✓      |     ✓      | Standardized version of the entity       |
| `specific_marker`   | string |      ✓      |     ✓      | Specific marker of the result            |
| `method`            | string |      ✓      |     ✓      | Method used to obtain the result         |
| `detection_status`  | string |      ✓      |     ✓      | Detection status of the result           |
| `score`             | string |      ✓      |            | Score of the biomarker result            |
| `numeric_value`     | number |      ✓      |     ✓      | Extracted numeric value                  |
| `unit`              | string |      ✓      |     ✓      | Unit of measurement                      |

In JSONL, `normalized_entity`, `specific_marker` and `method` sit at the entity level, and the other fields sit inside the `result` object. See [JSONL Format](./jsonl-format.md).

## Details and Additional Information {#detalhamentos-e-informações-adicionais}

### assertion field – Entity Context {#campo-assertion}

The `assertion` field indicates the **clinical context** in which an entity was mentioned in the document. The same term can mean different things depending on the context, which makes this field essential for accurate analyses.

#### Possible Values {#valores-possíveis}

| Value            | Name                | Description                                                                                                              | Example                                                                                      |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `PRESENT`        | Present             | Active condition in the patient at that time                                                                             | "Paciente apresenta diabetes tipo 2" (_patient has type 2 diabetes_)                         |
| `INVESTIGATION`  | Under investigation | Hypothesis, suspicion or diagnosis being worked up                                                                       | "Suspeita de pneumonia" (_suspected pneumonia_)                                              |
| `HISTORY`        | History             | Present in the past and may no longer be active                                                                          | "Histórico de cirurgia cardíaca em 2020" (_history of heart surgery in 2020_)                |
| `FAMILY_HISTORY` | Family history      | Refers to a relative, not the patient                                                                                    | "Mãe com câncer de mama" (_mother with breast cancer_)                                       |
| `ABSENT`         | Absent              | Term negated in the text                                                                                                 | "Paciente nega hipertensão" (_patient denies hypertension_)                                  |
| `OTHER`          | Other               | Mention outside the patient's clinical journey, such as a disease cited as a reference, in a study or in a support document | "Protocolo de rastreamento para câncer de colo" (_cervical cancer screening protocol_)       |

#### Why It Matters for Data Analysis {#importância-para-análise-de-dados}

- **Avoids false positives**: negated entities (`ABSENT`) should not be counted as present
- **Separates the patient from the family**: `FAMILY_HISTORY` entities do not describe the patient
- **Identifies suspicions**: `INVESTIGATION` entities indicate cases being worked up
- **Puts history in context**: `HISTORY` entities describe the patient's past
- **Filters out reference mentions**: `OTHER` entities are not part of the patient's clinical journey

#### Practical Example {#exemplo-prático}

```text
Text: "Paciente nega diabetes, com histórico de hipertensão. Mãe com câncer de mama.
Suspeita de insuficiência cardíaca."
(Patient denies diabetes, with a history of hypertension. Mother with breast cancer.
Suspected heart failure.)

Extracted entities:
- "diabetes" → assertion: ABSENT
- "hipertensão" → assertion: HISTORY
- "câncer de mama" → assertion: FAMILY_HISTORY
- "insuficiência cardíaca" → assertion: INVESTIGATION
```

#### Categories with Assertion {#categorias-com-asserção}

Context is inferred only for the **`FINDING`**, **`INJURY`**, **`DISEASE`**, **`PHARM_SUBSTANCE`**, **`PROCEDURE`** and **`MEDICAL_DEVICE`** categories.

In the other categories, the `assertion` field is empty. These entities are treated as present in the context of the document, and the empty field does not indicate an inference failure.

### Clinical Entity Categories {#categorias-de-entidades-clinicas}

| Label              | Name             | Description                                  | Example                                                                  |
| ------------------ | ---------------- | -------------------------------------------- | ------------------------------------------------------------------------ |
| `FINDING`          | Finding          | Reported symptoms and physical exam findings | "dor de cabeça" (_headache_), "febre" (_fever_), "edema"                 |
| `INJURY`           | Injury           | Physical injuries or poisonings              | "fratura" (_fracture_), "queda" (_fall_), "alergia" (_allergy_)          |
| `DISEASE`          | Disease          | Medical or pathological conditions           | "diabetes", "hipertensão" (_hypertension_)                               |
| `PHARM_SUBSTANCE`  | Drug             | Substances used in treatment                 | "metformina" (_metformin_), "morfina" (_morphine_)                       |
| `PROCEDURE`        | Procedure        | Diagnostic or therapeutic procedures         | "tomografia" (_CT scan_), "biópsia" (_biopsy_)                           |
| `STAGE`            | Stage            | Stage of a condition                         | "EC IV", "EC IIA" (_stage IV, stage IIA_)                                |
| `SCALE`            | Scale            | Standard assessment scales                   | "ECOG", "Glasgow"                                                        |
| `MEDICAL_DEVICE`   | Medical device   | Devices and equipment used in care           | "cateter venoso" (_venous catheter_), "dreno" (_drain_)                  |
| `BODY_PART`        | Body part        | Organs and anatomical components             | "mama" (_breast_), "pulmão" (_lung_)                                     |
| `TEMPORAL_CONCEPT` | Temporal concept | Dates and time expressions                   | "15/01/2024" (_DD/MM/YYYY_), "há 2 anos" (_2 years ago_)                 |
| `BIOMARKER`        | Biomarker        | Biological indicators of health or disease   | "KI67", "HER2", "PSA"                                                    |
| `LAB_TEST`         | Lab test         | Laboratory test results                      | "hemograma" (_complete blood count_), "glicemia em jejum" (_fasting glucose_) |

### Relation Types {#tipos-de-relacao}

Each relation links two entities: the first (`head`) and the second (`tail`), in that order.

| Relation type                       | Description                                          | Example (head → tail)                                                                        |
| ----------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `is_date_of`                        | Associates a date with a clinical event              | "15/01/2024" → "cirurgia" (_surgery_)                                                        |
| `finding_has_anatomic_site`         | Links a clinical finding to its anatomic site        | "edema" → "membros inferiores" (_lower limbs_)                                               |
| `may_treat`                         | Indicates that a drug may treat a condition          | "metformina" (_metformin_) → "diabetes"                                                      |
| `procedure_has_target_anatomy`      | Defines the anatomic target of a procedure           | "biópsia" (_biopsy_) → "fígado" (_liver_)                                                    |
| `disease_has_anatomic_site`         | Links a disease to its anatomic site                 | "pneumonia" → "pulmão" (_lung_)                                                              |
| `disease_has_associated_disease`    | Links a disease to another, associated disease       | "diabetes" → "retinopatia" (_retinopathy_)                                                   |
| `disease_has_biomarker`             | Links a disease to a biomarker                       | "câncer de mama" (_breast cancer_) → "HER2"                                                  |
| `disease_has_scale`                 | Links a disease to an assessment scale               | "câncer de pulmão" (_lung cancer_) → "ECOG"                                                  |
| `disease_has_stage`                 | Links a disease to its stage                         | "câncer de mama" (_breast cancer_) → "EC IIA" (_stage IIA_)                                  |
| `injury_has_anatomic_site`          | Links an injury to its anatomic site                 | "fratura" (_fracture_) → "fêmur" (_femur_)                                                   |
| `procedure_has_associated_device`   | Links a procedure to the device used                 | "angioplastia" (_angioplasty_) → "stent"                                                     |
| `medical_device_has_target_anatomy` | Defines the anatomic target of a medical device      | "cateter venoso central" (_central venous catheter_) → "veia jugular" (_jugular vein_)       |
| `disease_has_oncologic_finding`     | Links an oncologic disease to an oncologic finding   | "adenocarcinoma de pulmão" (_lung adenocarcinoma_) → "metástase" (_metastasis_)              |

> **Important**: the extraction contains only the patients and documents that meet the criteria defined for the project, a selected sample of our database with broad coverage and representativeness.
