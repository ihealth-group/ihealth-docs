# Data Analysis Guidelines

This page brings together best practices and examples for analyzing the extracted data, from preparation to advanced analyses. It is intended for data scientists and data analysts who will explore the extraction.

## Data Context {#contexto-dos-dados}

The **extracted data** is a selection of medical documents from our clinical database, with broad national coverage and representativeness for analyses, filtered according to the criteria defined for the project.

### Key Characteristics of the Extracted Data {#características-importantes-dos-dados-extraídos}

- **Source**: a clinical database with broad coverage and representativeness for studies and projects
- **Selection**: patients and documents filtered by specific criteria (diagnoses, medications, procedures, etc.)
- **Structuring**: data processed with Natural Language Processing (NLP) to extract clinical entities
- **Anonymization**: patient and provider identifiers are anonymized
- **Formats**: delivered in CSV and JSONL for different types of analysis
- **Language**: entity values are in Portuguese, as in the source documents. Filters on entity text, such as `inclusion_terms` below, must use the Portuguese terms

## Data Preparation {#preparação-dos-dados}

> The examples on this page are sequential: each block uses the imports and variables (`df`, `entities`) created in the previous blocks.

### Cleaning and Validation {#limpeza-e-validação}

#### For CSV {#para-csv}

```python
import pandas as pd

# Load extracted data in CSV format
df = pd.read_csv('extracted_data.csv')

# Drop rows with an empty document_id
df = df[df['document_id'].notna()]

# Convert dates
df['document_date'] = pd.to_datetime(df['document_date'])
df['birthdate'] = pd.to_datetime(df['birthdate'])

# An entity with more than one relation appears in more than one row (same entity_id).
# To count entities, use one row per entity_id.
entities = df.drop_duplicates('entity_id')

# Check the structure
print("Shape:", df.shape)
print("Columns:", df.columns.tolist())
print("Data types:", df.dtypes)
```

#### For JSONL {#para-jsonl}

```python
import json

# Load extracted data in JSONL format
data = []
with open('extracted_data.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data.append(json.loads(line))

print(f"Total documents: {len(data)}")

# Check the structure of the first document
if data:
    print("Structure of the first document:")
    print(json.dumps(data[0], indent=2, ensure_ascii=False))
```

### Handling Missing Values {#tratamento-de-valores-ausentes}

- **Empty fields**: blank in the CSV, and they become `NaN` when loaded with pandas
- **Missing numeric values**: empty `numeric_value` field
- **Structured fields**: filled in only for `BIOMARKER` and `LAB_TEST`, when normalization was possible
- **Assertion**: empty in the categories where context is not inferred
- **Relations**: not every entity has relations

```python
# Check empty fields per column
print("Empty fields per column:")
print(df.isna().sum())
```

## Recommended Analyses {#análises-recomendadas}

### 1. Descriptive Analysis {#1-análise-descritiva}

#### Cohort Characterization {#caracterizacao-da-coorte}

Patient fields repeat on every row. To describe the cohort, first build a table with one row per patient:

```python
# One row per patient
patients = df.groupby('patient_id').agg(
    gender=('gender', 'first'),
    birthdate=('birthdate', 'first'),
    death=('death', 'first'),
    first_doc=('document_date', 'min'),
    last_doc=('document_date', 'max'),
    n_docs=('document_id', 'nunique'),
)

# Age at the date of the first document
patients['age'] = (patients['first_doc'] - patients['birthdate']).dt.days / 365.25

print(f"Patients: {len(patients)}")
print("Age:")
print(patients['age'].describe())
print("Sex (%):")
print((patients['gender'].value_counts(normalize=True) * 100).round(1))
print("Death recorded (%):")
print((patients['death'].value_counts(normalize=True) * 100).round(1))
```

#### Entity Distribution {#distribuição-de-entidades}

```python
# Distribution by entity type
entity_distribution = entities['label'].value_counts()
print("Entity distribution:")
print(entity_distribution)

# Visualization
import matplotlib.pyplot as plt
plt.figure(figsize=(12, 6))
entity_distribution.plot(kind='bar')
plt.title('Entity Distribution by Type')
plt.xlabel('Entity Type')
plt.ylabel('Count')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

#### Most Frequent Entities {#entidades-mais-frequentes}

```python
# Leave out negated mentions, mentions about relatives and mentions outside the patient's journey
patient_entities = entities[~entities['assertion'].isin(['ABSENT', 'FAMILY_HISTORY', 'OTHER'])].copy()
patient_entities['entity_lower'] = patient_entities['entity'].str.lower()

# Entities mentioned for the most patients, by category
# (counting patients keeps those with more documents from weighing more)
for label in patient_entities['label'].dropna().unique():
    print(f"\n{label}:")
    top_in_category = (
        patient_entities[patient_entities['label'] == label]
        .groupby('entity_lower')['patient_id'].nunique()
        .sort_values(ascending=False)
        .head(10)
    )
    print(top_in_category)
```

#### Entity Context {#contexto-das-entidades}

```python
# Number of mentions by category and context (assertion).
# fillna keeps the categories without assertion in the table.
print(pd.crosstab(entities['label'], entities['assertion'].fillna('(empty)')))
```

### 2. Temporal Analysis {#2-análise-temporal}

The number of documents per period reflects the database coverage, not a clinical trend. For patient studies, it is usually more useful to look at each patient's follow-up (this uses the `patients` table from [Cohort Characterization](#caracterizacao-da-coorte)):

```python
# Follow-up time: from the patient's first to last document
patients['followup_months'] = (patients['last_doc'] - patients['first_doc']).dt.days / 30.44

print("Documents per patient:")
print(patients['n_docs'].describe())
print("Follow-up (months):")
print(patients['followup_months'].describe())

plt.figure(figsize=(10, 5))
patients['followup_months'].plot(kind='hist', bins=30)
plt.title('Follow-up Time per Patient')
plt.xlabel('Months between the first and last document')
plt.ylabel('Patients')
plt.tight_layout()
plt.show()
```

### 3. Geographic and Provider Type Analysis {#3-análise-geográfica-e-por-tipo-de-provedor}

```python
# Patients by state and by provider type.
# A patient seen at more than one provider is counted at each of them.
print("Patients by state:")
print(df.groupby('provider_state_code')['patient_id'].nunique().sort_values(ascending=False))

print("Patients by provider type:")
print(df.groupby('provider_type')['patient_id'].nunique().sort_values(ascending=False))
```

### 4. Relation Analysis {#4-análise-de-relações}

```python
# Each relation appears in two rows (one for the head entity and one for the tail).
# To count relations, use only the head rows.
relations = df[df['relation_position'] == 'head']

# Most common relations
relation_types = relations['relation_type'].value_counts()
print("Most common relation types:")
print(relation_types)

# Most related entities (as tail), by relation type
for relation_type, group in relations.groupby('relation_type'):
    print(f"\n{relation_type}:")
    print(group['relation_entity'].str.lower().value_counts().head(5))
```

## Specific Analyses {#análises-específicas}

### 1. Biomarker and Lab Test Analysis {#1-análise-de-biomarcadores-e-exames}

```python
# Filter biomarkers and lab tests with a numeric value
biomarkers = entities[entities['label'].isin(['BIOMARKER', 'LAB_TEST'])].copy()
biomarkers['numeric_value'] = pd.to_numeric(biomarkers['numeric_value'], errors='coerce')
biomarkers = biomarkers[biomarkers['numeric_value'].notna()]

# Identify each measurement by name and unit, so different units are not mixed
biomarkers['marker'] = biomarkers['normalized_entity'] + ' (' + biomarkers['unit'].fillna('no unit') + ')'

# The same result may be repeated across several of the patient's documents.
# To keep patients with more documents from weighing more, use one value per patient (here, the most recent).
latest = biomarkers.sort_values('document_date').groupby(['patient_id', 'marker']).tail(1)

# Statistics by measurement (one value per patient)
biomarker_stats = latest.groupby('marker')['numeric_value'].describe()
print("Statistics by measurement:")
print(biomarker_stats)

# Patients by detection status.
# A patient may appear under more than one status over time.
detection_analysis = entities[
    entities['label'].isin(['BIOMARKER', 'LAB_TEST'])
].groupby(['normalized_entity', 'detection_status'])['patient_id'].nunique().unstack(fill_value=0)

print("Patients by detection status:")
print(detection_analysis)
```

### 2. Comorbidity Analysis {#2-análise-de-comorbidades}

```python
from collections import Counter
from itertools import combinations

# The patient's diseases: present or in history (chronic diseases often come as "histórico de ...").
# Note: DISEASE has no normalized_entity. The text is used as it came from the document
# (lowercased), so synonyms such as "diabetes" and "DM2" count as different diseases.
diseases = entities[(entities['label'] == 'DISEASE') & entities['assertion'].isin(['PRESENT', 'HISTORY'])]

# The disease used to select the cohort appears in almost every patient and dominates the pairs.
# List its terms here (in Portuguese, as in the data) to leave it out.
inclusion_terms = []  # e.g. ['câncer de mama', 'neoplasia de mama']
diseases = diseases[~diseases['entity'].str.lower().isin(inclusion_terms)]

patient_diseases = diseases.groupby('patient_id')['entity'].apply(lambda x: sorted(set(x.str.lower())))

multi = patient_diseases[patient_diseases.apply(len) > 1]
print(f"Patients with more than one disease: {len(multi)}")

# Most frequent disease pairs in the same patient
pair_counts = Counter(pair for d in multi for pair in combinations(d, 2))
print("Most common disease pairs:")
for (a, b), n in pair_counts.most_common(10):
    print(f"  {a} + {b}: {n} patients")
```

### 3. Drugs Associated with Conditions {#3-fármacos-associados-a-condições}

```python
# Drug–condition pairs linked by the may_treat relation (excluding negated mentions).
# The relation reflects the association made in the text, not the treatment sequence or line.
may_treat = df[
    (df['label'] == 'PHARM_SUBSTANCE') &
    (df['relation_type'] == 'may_treat') &
    (df['relation_position'] == 'head') &
    (~df['assertion'].isin(['ABSENT', 'FAMILY_HISTORY', 'OTHER']))
]
drug_condition = (
    may_treat.assign(drug=may_treat['entity'].str.lower(),
                     condition=may_treat['relation_entity'].str.lower())
    .groupby(['drug', 'condition'])['patient_id'].nunique()
    .sort_values(ascending=False)
)

print("Drug–condition pairs (patients):")
print(drug_condition.head(20))
```

### 4. Data Quality Analysis {#4-análise-de-qualidade-dos-dados}

```python
structured = entities[entities['label'].isin(['BIOMARKER', 'LAB_TEST'])]

# Different spellings grouped under each normalized entity (worth reviewing the most varied ones)
spellings = structured.groupby('normalized_entity')['entity'].nunique().sort_values(ascending=False)
print("Spellings per normalized entity:")
print(spellings.head(10))

# Biomarkers and lab tests that could not be normalized
not_normalized = structured[structured['normalized_entity'].isna()]['entity'].str.lower().value_counts()
print("Most frequent without normalization:")
print(not_normalized.head(10))

# Check how often the structured fields are filled in (score only applies to BIOMARKER)
structured_fields = ['normalized_entity', 'specific_marker', 'method',
                     'detection_status', 'score', 'numeric_value', 'unit']
coverage = structured.groupby('label')[structured_fields].agg(
    lambda col: col.notna().mean()
)

print("Structured field completeness by category (%):")
print((coverage * 100).round(1))
```

## Specific Considerations {#considerações-específicas}

### 1. Anonymization {#1-anonimização}

- **Patient and case IDs**: anonymized to preserve privacy
- **Privacy**: keep the data confidential in all analyses

### 2. Data Quality {#2-qualidade-dos-dados}

```python
# Entities without assertion (only in the categories where it is inferred)
labels_with_assertion = ['FINDING', 'INJURY', 'DISEASE', 'PHARM_SUBSTANCE',
                         'PROCEDURE', 'MEDICAL_DEVICE']
entities_without_assertion = entities[
    entities['label'].isin(labels_with_assertion) &
    entities['assertion'].isna()
].shape[0]
print(f"Entities without assertion: {entities_without_assertion}")
```

### 3. Clinical Context {#3-contexto-clínico}

```python
# Per-document analysis
doc_analysis = df.groupby('document_id').agg({
    'entity_id': 'nunique',
    'label': lambda x: list(x.unique()),
    'patient_id': 'first'
})

print("Per-document analysis:")
print(doc_analysis.head())

# Documents with the most entities
richest_docs = doc_analysis.sort_values('entity_id', ascending=False)
print("Documents with the most entities:")
print(richest_docs.head(10))
```

## Advanced Analysis Examples {#exemplos-de-análises-avançadas}

### Lab Test Trajectory per Patient {#trajetória-de-exames-por-paciente}

A monthly average of a lab test mixes different patients in each period. To follow how values change, look at each patient's values over time.

> **Note**: `document_date` is the date of the document, not necessarily the date of the test. A result may be transcribed into later documents; that is why the example removes repeated values for the same patient.

```python
# Measurement with the most patients
marker = biomarkers.groupby('marker')['patient_id'].nunique().idxmax()

values = (
    biomarkers[biomarkers['marker'] == marker]
    .drop_duplicates(['patient_id', 'numeric_value'])
    .sort_values('document_date')
)
# Days since the patient's first measurement
values['days'] = (values['document_date'] - values.groupby('patient_id')['document_date'].transform('min')).dt.days

# Patients with at least 2 measurements
values = values[values.groupby('patient_id')['patient_id'].transform('size') >= 2]

plt.figure(figsize=(12, 6))
for patient_id, group in values.groupby('patient_id'):
    plt.plot(group['days'], group['numeric_value'], marker='o', alpha=0.4)

plt.title(f'Trajectory per Patient: {marker}')
plt.xlabel('Days since the first measurement')
plt.ylabel('Value')
plt.tight_layout()
plt.show()
```

## Best Practices {#boas-práticas}

Recommendations on clinical validation, documentation and reproducibility of analyses are in [Limitations and Considerations](./limitations.md#recomendacoes).
