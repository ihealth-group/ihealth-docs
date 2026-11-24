# JSONL Format

This page describes the extraction's JSONL file, in which each line is a document with its entities grouped together, and provides Python code examples to read and analyze the data. It is intended for anyone who needs to preserve the document context or work with the relations between entities.

## Characteristics {#características}

- **Granularity**: each line corresponds to 1 complete document
- **Structure**: nested data, preserving the original hierarchy
- **Recommended use**: document-level analyses and preserving clinical context

> **Relation to the Data Structure**: JSONL has the same fields described in [Data Structure](./data-structure.md), but grouped hierarchically, which better preserves the original clinical context.

## JSONL File Structure {#estrutura-do-arquivo-jsonl}

### General Format {#formato-geral}

Each line of the JSONL file contains a complete JSON object representing a document. Entity and `provider_type` values are in Portuguese, as in the delivered files.

```json
{
  "document_id": "doc_123",
  "document_date": "2023-05-31 13:15:47",
  "patient_id": "patient_abc123",
  "case_id": "case_xyz789",
  "gender": "FEMALE",
  "birthdate": "1980-05-15 00:00:00",
  "death": "N",
  "provider_state_code": "SP",
  "provider_type": "Público",
  "preds": {
    "clinical_entities": [...],
    "biomarkers": [...],
    "lab_tests": [...],
    "entities_relations": [...]
  }
}
```

## Nested Entity Structure {#estrutura-aninhada-das-entidades}

> **Important**: the JSONL format preserves nested structures that do not exist in the CSV. They allow a richer, more contextualized representation of the clinical data, keeping the original hierarchy of the documents.

### JSONL-Specific Nested Structures {#estruturas-aninhadas-específicas-do-jsonl}

#### 1. The `result` Object: Biomarkers and Lab Tests {#1-objeto-result-biomarcadores-e-exames}

The [structured fields](./data-structure.md#campos-estruturados-de-biomarcadores-e-exames) for biomarkers and lab tests are split across two levels:

- **At the entity level**: `normalized_entity`, `specific_marker` and `method`
- **Inside `result`**: `detection_status`, `numeric_value`, `unit` and, for biomarkers only, `score`

#### 2. Grouping by Category {#2-agrupamento-por-categoria}

JSONL organizes entities into groups inside the `preds` object:

- `clinical_entities`: entities from the other categories (diseases, clinical findings, drugs, procedures, etc.)
- `biomarkers`: biomarkers (`BIOMARKER`)
- `lab_tests`: lab tests (`LAB_TEST`)
- `entities_relations`: relations between entities

### 1. Clinical Entities (`clinical_entities`) {#1-entidades-clínicas-clinical_entities}

```json
"clinical_entities": [
  {
    "entity_id": "doc_123_45",
    "entity": "câncer de mama",
    "label": "DISEASE",
    "assertion": "PRESENT"
  },
  {
    "entity_id": "doc_123_60",
    "entity": "mama esquerda",
    "label": "BODY_PART",
    "assertion": ""
  }
]
```

### 2. Biomarkers (`biomarkers`) {#2-biomarcadores-biomarkers}

```json
"biomarkers": [
  {
    "entity_id": "doc_123_120",
    "entity": "HER2 3+",
    "label": "BIOMARKER",
    "normalized_entity": "HER2",
    "specific_marker": "",
    "method": "imuno-histoquímica",
    "result": {
      "detection_status": "POS",
      "score": "3+",
      "numeric_value": "",
      "unit": ""
    }
  },
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
    "specific_marker": "",
    "method": "",
    "result": {
      "detection_status": "",
      "numeric_value": 150000.0,
      "unit": "mm³"
    }
  },
  {
    "entity_id": "doc_123_210",
    "entity": "vitamina D 25 ng/mL",
    "label": "LAB_TEST",
    "normalized_entity": "Vitamina D",
    "specific_marker": "",
    "method": "",
    "result": {
      "detection_status": "",
      "numeric_value": 25.0,
      "unit": "ng/mL"
    }
  }
]
```

### 4. Relations between Entities (`entities_relations`) {#4-relações-entre-entidades-entities_relations}

```json
"entities_relations": [
  {
    "relation_type": "disease_has_biomarker",
    "head_entity": "câncer de mama",
    "tail_entity": "HER2 3+"
  },
  {
    "relation_type": "disease_has_anatomic_site",
    "head_entity": "câncer de mama",
    "tail_entity": "mama esquerda"
  }
]
```

## Working with JSONL {#trabalhando-com-jsonl}

> The examples on this page are sequential: each block uses the `data` variable created in "Loading Data".

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
        print(f"Method: {biomarker['method']}")

        # Access the result
        if 'result' in biomarker:
            result = biomarker['result']
            print(f"Status: {result['detection_status']}")
            print(f"Score: {result['score']}")
            print(f"Value: {result['numeric_value']}")
            print(f"Unit: {result['unit']}")
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
        print(f"Method: {lab_test['method']}")

        if 'result' in lab_test:
            result = lab_test['result']
            print(f"Status: {result['detection_status']}")
            print(f"Value: {result['numeric_value']}")
            print(f"Unit: {result['unit']}")
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

### Per-Document Summary and Patient Journey {#resumo-por-documento-e-jornada-do-paciente}

```python
import pandas as pd

# One row per document, with the number of items in each group
docs = pd.DataFrame([
    {
        'document_id': doc['document_id'],
        'patient_id': doc['patient_id'],
        'document_date': doc['document_date'],
        **{group: len(items) for group, items in doc['preds'].items()},
    }
    for doc in data
])
docs['document_date'] = pd.to_datetime(docs['document_date'])

print(docs.describe())

# Patient journey: documents in chronological order
patient_id = docs['patient_id'].iloc[0]
print(docs[docs['patient_id'] == patient_id].sort_values('document_date'))
```

### Converting to DataFrames {#convertendo-para-dataframes}

For tabular analyses, each `preds` group can become a DataFrame, with the document data on each row:

```python
import pandas as pd

def to_dataframe(data, group):
    """Turn a preds group (e.g. 'biomarkers') into a DataFrame."""
    df = pd.json_normalize(
        data,
        record_path=['preds', group],
        meta=['document_id', 'document_date', 'patient_id'],
    )
    # Remove the "result." prefix from the structured fields
    df.columns = [col.replace('result.', '') for col in df.columns]
    return df

clinical_df = to_dataframe(data, 'clinical_entities')
biomarkers_df = to_dataframe(data, 'biomarkers')
lab_tests_df = to_dataframe(data, 'lab_tests')
relations_df = to_dataframe(data, 'entities_relations')

# In JSONL, empty fields come as "": convert numeric values before analyzing them
biomarkers_df['numeric_value'] = pd.to_numeric(biomarkers_df['numeric_value'], errors='coerce')
lab_tests_df['numeric_value'] = pd.to_numeric(lab_tests_df['numeric_value'], errors='coerce')

print(biomarkers_df.head())
```

### Comorbidity Analysis {#análise-de-comorbidades}

```python
from collections import Counter, defaultdict
from itertools import combinations

# The patient's diseases: present or in history (chronic diseases often come as "histórico de ...").
# Note: DISEASE has no normalized_entity. The text is used as it came from the document
# (lowercased), so synonyms such as "diabetes" and "DM2" count as different diseases.
# The disease used to select the cohort appears in almost every patient and dominates the pairs.
# List its terms here (in Portuguese, as in the data) to leave it out.
inclusion_terms = set()  # e.g. {'câncer de mama', 'neoplasia de mama'}

patient_diseases = defaultdict(set)
for doc in data:
    for entity in doc['preds']['clinical_entities']:
        name = entity['entity'].lower()
        if (entity['label'] == 'DISEASE'
                and entity.get('assertion') in ('PRESENT', 'HISTORY')
                and name not in inclusion_terms):
            patient_diseases[doc['patient_id']].add(name)

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
  "detection_status": "",
  "numeric_value": 12.5,
  "unit": "g/dL"
}
```

**CSV** (flattened):

```csv
detection_status,numeric_value,unit
,12.5,g/dL
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

| Aspect         | JSONL                                    | CSV                                                         |
| -------------- | ---------------------------------------- | ----------------------------------------------------------- |
| **Structure**  | Object with `head_entity` and `tail_entity` | Separate `relation_entity` and `relation_position` fields |
| **Clarity**    | Explicit relation between two entities   | Implicit relation, requires interpreting the position       |
| **Processing** | Direct access to the related entities    | Fields must be combined to understand the relation          |
| **Rows**       | One line per complete relation           | One row per "side" of the relation                          |

### 3. When to Use JSONL or CSV {#3-quando-usar-jsonl-ou-csv}

**Use JSONL when:**

- the analysis depends on the full document context or the patient journey
- the focus is on relations between entities (for example, disease and biomarker, drug and condition)
- you want the relation to be explicit, with `head_entity` and `tail_entity`

**Use CSV when:**

- the focus is on statistics of individual entities (frequency, distribution)
- your tools work better with tabular data
- you prefer a simple structure, with no nesting
