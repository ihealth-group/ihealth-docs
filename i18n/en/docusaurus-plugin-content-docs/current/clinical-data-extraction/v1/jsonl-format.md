---
displayed_sidebar: docsSidebar
pagination_prev: clinical-data-extraction/v1/csv-format
pagination_next: clinical-data-extraction/v1/delivery
---

# JSONL Format

:::caution v1 documentation
This documentation covers extractions delivered **up to September 20, 2026**. See the [current version](/clinical-data-extraction/jsonl-format).
:::

## Characteristics {#características}

- **Granularity**: each line = 1 complete document
- **Structure**: nested data preserving the original hierarchy
- **Recommended use**: document-level analyses, preserving clinical context

> **Relation to the Data Structure**: this JSONL format implements the same data structure described in [Data Structure](./data-structure.md), but with specific nested organizations that better preserve the original clinical context. The basic fields stay the same, but they are grouped and structured hierarchically.

## JSONL File Structure {#estrutura-do-arquivo-jsonl}

### General Format {#formato-geral}

Each line of the JSONL file contains a complete JSON object representing a document. Entity, `assertion`, `term_desc` and `provider_type` values are in Portuguese, as in the delivered files.

```json
{
  "document_id": "doc_123",
  "document_date": "2023-05-31 13:15:47",
  "patient_id": "patient_abc123",
  "case_id": "case_xyz789",
  "gender": "MALE",
  "birthdate": "1980-05-15 00:00:00",
  "death": "N",
  "provider_state_code": "SP",
  "provider_type": "Convênio ou Particular",
  "preds": {
    "clinical_entities": [...],
    "biomarkers": [...],
    "lab_tests": [...],
    "vital_signs": [...],
    "entities_relations": [...]
  }
}
```

## Nested Entity Structure {#estrutura-aninhada-das-entidades}

> **Important**: the JSONL format preserves nested structures that are not present in the CSV format. These structures allow a richer, more contextualized representation of the clinical data, keeping the original hierarchy of the documents.

### JSONL-Specific Nested Structures {#estruturas-aninhadas-específicas-do-jsonl}

#### 1. The `el` Object (Entity Linking) - Clinical Entities {#1-objeto-el-entity-linking---entidades-clínicas}

For clinical entities with a standardized terminology, JSONL uses a nested `el` object that contains:

- `terminology`: coding system (CID-10, the Brazilian ICD-10; ATC; TUSS)
- `term_code`: specific code in the terminology
- `term_desc`: standardized description of the term (in Portuguese)

#### 2. The `result` Object - Biomarkers, Lab Tests and Vital Signs {#2-objeto-result---biomarcadores-exames-e-sinais-vitais}

For entities with structured values, JSONL uses a nested `result` object that contains:

- `numeric_value`: numeric value (when available)
- `unit`: unit of measurement
- `detection_status`: detection status (for biomarkers and lab tests)
- `condition`: associated conditions (for vital signs)

#### 3. Grouping by Category {#3-agrupamento-por-categoria}

JSONL organizes entities into specific groups inside the `preds` object:

- `clinical_entities`: diseases, symptoms, procedures, etc.
- `biomarkers`: biomarkers with structured values
- `lab_tests`: lab tests
- `vital_signs`: vital signs and clinical measurements
- `entities_relations`: relations between entities

### 1. Clinical Entities (`clinical_entities`) {#1-entidades-clínicas-clinical_entities}

```json
"clinical_entities": [
  {
    "entity_id": "doc_123_45",
    "entity": "hipertensão",
    "label": "DISEASE",
    "assertion": "PRESENTE",
    "el": {
      "terminology": "CID-10",
      "term_code": "I10",
      "term_desc": "Hipertensão arterial essencial"
    }
  }
]
```

### 2. Biomarkers (`biomarkers`) {#2-biomarcadores-biomarkers}

```json
"biomarkers": [
  {
    "entity_id": "doc_123_120",
    "entity": "HER2 positivo",
    "label": "BIOMARKER",
    "normalized_entity": "HER2",
    "specific_marker": "",
    "loinc_code": "48676-1",
    "result": {
      "numeric_value": "",
      "unit": "",
      "detection_status": "POS"
    }
  },
  {
    "entity_id": "doc_123_130",
    "entity": "KI67 25%",
    "label": "BIOMARKER",
    "normalized_entity": "KI67",
    "specific_marker": "",
    "loinc_code": "29593-1",
    "result": {
      "numeric_value": 25,
      "unit": "%",
      "detection_status": ""
    }
  }
]
```

### 3. Lab Tests (`lab_tests`) {#3-exames-laboratoriais-lab_tests}

```json
"lab_tests": [
  {
    "entity_id": "doc_123_200",
    "entity": "plaquetas 150.000/mm³",
    "label": "LAB_TEST",
    "normalized_entity": "Plaquetas",
    "result": {
      "numeric_value": 150000.0,
      "unit": "mm³",
      "detection_status": ""
    }
  },
  {
    "entity_id": "doc_123_210",
    "entity": "vitamina D 25 ng/mL",
    "label": "LAB_TEST",
    "normalized_entity": "Vitamina D",
    "result": {
      "numeric_value": 25.0,
      "unit": "ng/mL",
      "detection_status": ""
    }
  }
]
```

### 4. Vital Signs (`vital_signs`) {#4-sinais-vitais-vital_signs}

```json
"vital_signs": [
  {
    "entity_id": "doc_123_300",
    "entity": "altura 1.70 m",
    "label": "CLINICAL_ATT",
    "normalized_entity": "Altura",
    "result": {
      "numeric_value": 1.7,
      "unit": "m",
      "condition": ""
    }
  },
  {
    "entity_id": "doc_123_310",
    "entity": "peso 75 kg",
    "label": "CLINICAL_ATT",
    "normalized_entity": "Peso",
    "result": {
      "numeric_value": 75.0,
      "unit": "kg",
      "condition": ""
    }
  }
]
```

### 5. Relations between Entities (`entities_relations`) {#5-relações-entre-entidades-entities_relations}

```json
"entities_relations": [
  {
    "relation_type": "may_treat",
    "head_entity": "metformina",
    "tail_entity": "diabetes"
  },
  {
    "relation_type": "procedure_has_target_anatomy",
    "head_entity": "rx toráx",
    "tail_entity": "tórax"
  }
]
```

## Working with JSONL {#trabalhando-com-jsonl}

### Loading Data {#carregando-dados}

```python
import json

# Load the JSONL data
data = []
with open('extracted_data.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data.append(json.loads(line))

print(f"Total documents: {len(data)}")
```

### Accessing Clinical Entities {#acessando-entidades-clínicas}

```python
# Access clinical entities
for doc in data:
    print(f"Document: {doc['document_id']}")
    for entity in doc['preds']['clinical_entities']:
        print(f"  ID: {entity['entity_id']}")
        print(f"  Entity: {entity['entity']}")
        print(f"  Label: {entity['label']}")
        print(f"  Assertion: {entity['assertion']}")

        # Access the terminology
        if 'el' in entity:
            print(f"  Terminology: {entity['el']['terminology']}")
            print(f"  Code: {entity['el']['term_code']}")
        print("---")
```

### Accessing Biomarkers {#acessando-biomarcadores}

```python
# Access biomarkers
for doc in data:
    for biomarker in doc['preds']['biomarkers']:
        print(f"ID: {biomarker['entity_id']}")
        print(f"Biomarker: {biomarker['entity']}")
        print(f"Normalized: {biomarker['normalized_entity']}")
        print(f"LOINC: {biomarker['loinc_code']}")

        # Access the result
        if 'result' in biomarker:
            result = biomarker['result']
            print(f"Value: {result['numeric_value']}")
            print(f"Unit: {result['unit']}")
            print(f"Status: {result['detection_status']}")
        print("---")
```

### Accessing Lab Tests {#acessando-exames-laboratoriais}

```python
# Access lab tests
for doc in data:
    for lab_test in doc['preds']['lab_tests']:
        print(f"ID: {lab_test['entity_id']}")
        print(f"Lab test: {lab_test['entity']}")
        print(f"Normalized: {lab_test['normalized_entity']}")

        if 'result' in lab_test:
            result = lab_test['result']
            print(f"Value: {result['numeric_value']}")
            print(f"Unit: {result['unit']}")
            print(f"Status: {result['detection_status']}")
        print("---")
```

### Accessing Vital Signs {#acessando-sinais-vitais}

```python
# Access vital signs
for doc in data:
    for vital in doc['preds']['vital_signs']:
        print(f"ID: {vital['entity_id']}")
        print(f"Vital sign: {vital['entity']}")
        print(f"Normalized: {vital['normalized_entity']}")

        if 'result' in vital:
            result = vital['result']
            print(f"Value: {result['numeric_value']}")
            print(f"Unit: {result['unit']}")
            print(f"Condition: {result['condition']}")
        print("---")
```

### Accessing Relations {#acessando-relações}

```python
# Access relations
for doc in data:
    for relation in doc['preds']['entities_relations']:
        print(f"Relation: {relation['relation_type']}")
        print(f"From: {relation['head_entity']}")
        print(f"To: {relation['tail_entity']}")
        print("---")
```

## Analyses with JSONL {#análises-com-jsonl}

### Per-Document Analysis {#análise-por-documento}

```python
# Document analysis
for doc in data:
    doc_id = doc['document_id']
    patient_id = doc['patient_id']

    # Count entities by type
    clinical_count = len(doc['preds']['clinical_entities'])
    biomarker_count = len(doc['preds']['biomarkers'])
    lab_count = len(doc['preds']['lab_tests'])
    vital_count = len(doc['preds']['vital_signs'])
    relation_count = len(doc['preds']['entities_relations'])

    print(f"Document {doc_id} (Patient {patient_id}):")
    print(f"  Clinical entities: {clinical_count}")
    print(f"  Biomarkers: {biomarker_count}")
    print(f"  Lab tests: {lab_count}")
    print(f"  Vital signs: {vital_count}")
    print(f"  Relations: {relation_count}")
    print("---")
```

### Extracting Data for Analysis {#extraindo-dados-para-análise}

```python
# Extract all biomarkers
all_biomarkers = []
for doc in data:
    for biomarker in doc['preds']['biomarkers']:
        biomarker_data = {
            'document_id': doc['document_id'],
            'patient_id': doc['patient_id'],
            'entity_id': biomarker['entity_id'],
            'entity': biomarker['entity'],
            'normalized_entity': biomarker['normalized_entity'],
            'loinc_code': biomarker['loinc_code']
        }

        if 'result' in biomarker:
            biomarker_data.update(biomarker['result'])

        all_biomarkers.append(biomarker_data)

# Convert to a DataFrame
import pandas as pd
biomarkers_df = pd.DataFrame(all_biomarkers)
print(biomarkers_df.head())
```

### Comorbidity Analysis {#análise-de-comorbidades}

```python
from collections import Counter, defaultdict
from itertools import combinations

# Confirmed diseases per patient (in v1, assertion values are in Portuguese: 'PRESENTE').
# Note: DISEASE has no normalized_entity. The text is used as it came from the document
# (lowercased), so synonyms such as "diabetes" and "DM2" count as different diseases.
# The term_code (CID-10, in the el object) can help group synonyms, but it is missing
# for many entities: use it as support, without dropping the diseases that have no code.
patient_diseases = defaultdict(set)
for doc in data:
    for entity in doc['preds']['clinical_entities']:
        if entity['label'] == 'DISEASE' and entity.get('assertion') == 'PRESENTE':
            patient_diseases[doc['patient_id']].add(entity['entity'].lower())

multi = {p: d for p, d in patient_diseases.items() if len(d) > 1}
print(f"Patients with more than one disease: {len(multi)}")

# Most frequent disease pairs in the same patient
pair_counts = Counter(pair for d in multi.values() for pair in combinations(sorted(d), 2))
for (a, b), n in pair_counts.most_common(10):
    print(f"  {a} + {b}: {n} patients")
```

## Differences between CSV and JSONL {#diferenças-entre-csv-e-jsonl}

### 1. Result Structure {#1-estrutura-de-resultados}

**JSONL** (nested):

```json
"result": {
  "numeric_value": 12.5,
  "unit": "g/dL",
  "detection_status": ""
}
```

**CSV** (flattened):

```csv
numeric_value,unit,detection_status
12.5,g/dL,
```

### 2. Relation Format {#2-formato-de-relações}

An important difference between the formats is how relations between entities are represented:

#### JSONL - Structured Relations {#jsonl---relações-estruturadas}

```json
"entities_relations": [
  {
    "relation_type": "may_treat",
    "head_entity": "metformina",
    "tail_entity": "diabetes"
  }
]
```

#### CSV - Flattened Relations {#csv---relações-achatadas}

```csv
entity,relation_type,relation_entity,relation_position
metformina,may_treat,diabetes,head
diabetes,may_treat,metformina,tail
```

In the example, the drug **metformina** (_metformin_) may treat the disease **diabetes** (`may_treat`). In JSONL, the relation appears once, with the drug as `head_entity` and the disease as `tail_entity`. In CSV, each entity has its own row: `relation_entity` indicates the other entity in the relation and `relation_position` indicates the position of the row's entity (`head` or `tail`).

**Main Differences:**

| Aspect         | JSONL                                       | CSV                                                       |
| -------------- | ------------------------------------------- | --------------------------------------------------------- |
| **Structure**  | Object with `head_entity` and `tail_entity` | Separate `relation_entity` and `relation_position` fields |
| **Clarity**    | Explicit relation between two entities      | Implicit relation, requires interpreting the position     |
| **Processing** | Direct access to the related entities       | Fields must be combined to understand the relation        |
| **Rows**       | One line per complete relation              | One row per "side" of the relation                        |

### 3. Important Considerations {#3-considerações-importantes}

#### Impact on Analyses {#impacto-nas-análises}

**Relation Analysis:**

- **JSONL**: more intuitive for analyzing direct relationships
- **CSV**: requires aggregating and rebuilding the relations

**Performance:**

- **JSONL**: better for analyses of complete documents
- **CSV**: better for statistical analyses of individual entities

**Processing Complexity:**

- **JSONL**: more complex structure, but richer in context
- **CSV**: simpler structure, but loses relationship information

#### Usage Recommendations {#recomendações-de-uso}

**Use JSONL when:**

- Analyzing comorbidities and relationships between conditions
- Studying patterns by document or patient
- Preserving the full clinical context
- Working with entity network analyses

**Use CSV when:**

- Running statistical analyses of individual entities
- Working with tools that prefer tabular data
- Running frequency and distribution analyses
- Processing large volumes of data with a focus on performance

### Advantages of JSONL {#vantagens-do-jsonl}

1. **Context Preservation**: keeps the original structure of the data
2. **Flexibility**: allows more complex analyses
3. **Hierarchy**: preserves relationships between entities
4. **Efficiency**: one line per document makes processing easier
5. **Explicit Relations**: clear representation of relationships between entities

### When to Use JSONL {#quando-usar-jsonl}

- Analyses that require the full document context
- Studies of comorbidities and relationships
- Analyses by patient or clinical case
- Preserving the hierarchical structure
- Network analyses of clinical entities
