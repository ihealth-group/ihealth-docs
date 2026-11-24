---
displayed_sidebar: docsSidebar
pagination_prev: clinical-data-extraction/v1/delivery
pagination_next: clinical-data-extraction/v1/limitations
---

# Data Analysis Guidelines

:::caution v1 documentation
This documentation covers extractions delivered **up to September 20, 2026**. See the [current version](/clinical-data-extraction/analysis-guidelines).
:::

## Data Context {#contexto-dos-dados}

This documentation provides guidelines for analyzing the **data extracted** from our clinical database. This data is a specific selection of medical documents from our database, with broad national coverage and representativeness for analyses, filtered according to the criteria defined for the project.

### Key Characteristics of the Extracted Data {#características-importantes-dos-dados-extraídos}

- **Source**: a clinical database with broad coverage and representativeness for studies and projects
- **Selection**: patients and documents filtered by specific criteria (diagnoses, medications, procedures, etc.)
- **Structuring**: data processed with Natural Language Processing (NLP) to extract clinical entities
- **Anonymization**: patient and provider identifiers are anonymized
- **Formats**: delivered in CSV and JSONL for different types of analysis
- **Language**: entity values and, in v1, `assertion` values are in Portuguese, as in the delivered files. Filters on these values, such as `'PRESENTE'` and `'AUSENTE'` below, must use the Portuguese values

## Data Preparation {#preparação-dos-dados}

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
- **Terminology codes**: may be missing
- **Relations**: not every entity has relations

```python
# Check empty fields per column
print("Empty fields per column:")
print(df.isna().sum())
```

## Recommended Analyses {#análises-recomendadas}

### 1. Descriptive Analysis {#1-análise-descritiva}

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
# Leave out negated mentions
patient_entities = entities[~entities['assertion'].isin(['AUSENTE'])]

# Top 20 most frequent entities
top_entities = patient_entities['entity'].value_counts().head(20)
print("Most frequent entities:")
print(top_entities)

# Entities by category
for label in patient_entities['label'].dropna().unique():
    print(f"\n{label}:")
    top_in_category = patient_entities[patient_entities['label'] == label]['entity'].value_counts().head(10)
    print(top_in_category)
```

#### Entity Context {#contexto-das-entidades}

```python
# Number of mentions by category and context (assertion)
print(pd.crosstab(entities['label'], entities['assertion']))
```

### 2. Temporal Analysis {#2-análise-temporal}

```python
# Temporal analysis
df['document_date'] = pd.to_datetime(df['document_date'])
df['month'] = df['document_date'].dt.to_period('M')
df['year'] = df['document_date'].dt.year

# Documents per month
monthly_docs = df.groupby('month')['document_id'].nunique()
print("Documents per month:")
print(monthly_docs)

# Trend over time
plt.figure(figsize=(12, 6))
monthly_docs.plot(kind='line', marker='o')
plt.title('Documents per Month')
plt.xlabel('Month')
plt.ylabel('Number of Documents')
plt.tight_layout()
plt.show()
```

### 3. Geographic Analysis {#3-análise-geográfica}

```python
# Patients by state (each row is an entity, so count distinct patients).
# A patient seen in more than one state is counted in each of them.
patients_by_state = df.groupby('provider_state_code')['patient_id'].nunique().sort_values(ascending=False)
print("Patients by state:")
print(patients_by_state)
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

# Most related entities (as tail)
related_entities = relations['relation_entity'].value_counts()
print("Most related entities:")
print(related_entities.head(20))
```

## Specific Analyses {#análises-específicas}

### 1. Biomarker Analysis {#1-análise-de-biomarcadores}

```python
# Filter biomarkers and lab tests with a numeric value
biomarkers = entities[entities['label'].isin(['BIOMARKER', 'LAB_TEST', 'CLINICAL_ATT'])].copy()
biomarkers['numeric_value'] = pd.to_numeric(biomarkers['numeric_value'], errors='coerce')
biomarkers = biomarkers[biomarkers['numeric_value'].notna()]

# Identify each measurement by name and unit, so different units are not mixed
biomarkers['marker'] = biomarkers['normalized_entity'] + ' (' + biomarkers['unit'].fillna('no unit') + ')'

# Statistics by measurement
biomarker_stats = biomarkers.groupby('marker')['numeric_value'].describe()
print("Statistics by measurement:")
print(biomarker_stats)

# Analysis by detection status
detection_analysis = entities[
    entities['label'].isin(['BIOMARKER', 'LAB_TEST'])
].groupby(['normalized_entity', 'detection_status']).size().unstack(fill_value=0)

print("Analysis by detection status:")
print(detection_analysis)
```

### 2. Comorbidity Analysis {#2-análise-de-comorbidades}

```python
from collections import Counter
from itertools import combinations

# Confirmed diseases in the patient (in v1, assertion values are in Portuguese: 'PRESENTE').
# Note: DISEASE has no normalized_entity. The text is used as it came from the document
# (lowercased), so synonyms such as "diabetes" and "DM2" count as different diseases.
# The term_code (CID-10) can help group synonyms, but it is missing for many
# entities: use it as support, without dropping the diseases that have no code.
diseases = entities[(entities['label'] == 'DISEASE') & (entities['assertion'] == 'PRESENTE')]
patient_diseases = diseases.groupby('patient_id')['entity'].apply(lambda x: sorted(set(x.str.lower())))

multi = patient_diseases[patient_diseases.apply(len) > 1]
print(f"Patients with more than one disease: {len(multi)}")

# Most frequent disease pairs in the same patient
pair_counts = Counter(pair for d in multi for pair in combinations(d, 2))
print("Most common disease pairs:")
for (a, b), n in pair_counts.most_common(10):
    print(f"  {a} + {b}: {n} patients")
```

### 3. Treatment Pattern Analysis {#3-análise-de-padrões-de-tratamento}

```python
# Link medications to conditions (excluding negated mentions)
treatment_patterns = df[
    (df['label'] == 'PHARM_SUBSTANCE') &
    (df['relation_type'] == 'may_treat') &
    (~df['assertion'].isin(['AUSENTE']))
].groupby(['entity', 'relation_entity']).size().sort_values(ascending=False)

print("Most common treatment patterns:")
print(treatment_patterns.head(20))
```

### 4. Data Quality Analysis {#4-análise-de-qualidade-dos-dados}

```python
# Check consistency between entity and normalized_entity
inconsistent_entities = entities[
    entities['normalized_entity'].notna() &
    (entities['entity'] != entities['normalized_entity'])
][['entity', 'normalized_entity', 'label']].drop_duplicates()

print("Normalized entities:")
print(inconsistent_entities.head(10))

# Check terminology codes
terminology_coverage = entities[
    entities['terminology'].notna()
].groupby('label')['terminology'].value_counts()

print("Terminology coverage by category:")
print(terminology_coverage)
```

## Specific Considerations {#considerações-específicas}

### 1. Anonymization {#1-anonimização}

- **Patient and case IDs**: anonymized to preserve privacy
- **Privacy**: keep the data confidential in all analyses

### 2. Data Quality {#2-qualidade-dos-dados}

```python
# Entities without assertion (only in the categories where it is inferred)
labels_with_assertion = ['DISEASE', 'PROCEDURE', 'PHARM_SUBSTANCE', 'SYMPTOM',
                         'FINDING', 'INJURY', 'VENT_SUPPORT', 'MEDICAL_DEVICE']
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

### Time Series Analysis {#análise-de-séries-temporais}

```python
# Temporal analysis of biomarkers
temporal_biomarkers = biomarkers.copy()
temporal_biomarkers['date'] = pd.to_datetime(temporal_biomarkers['document_date'])

# Group by month and measurement
monthly_biomarkers = temporal_biomarkers.groupby([
    temporal_biomarkers['date'].dt.to_period('M'),
    'marker'
])['numeric_value'].mean().unstack()
monthly_biomarkers.index = monthly_biomarkers.index.to_timestamp()

# The 5 measurements with the most records
top_markers = biomarkers['marker'].value_counts().head(5).index

# Plot the trends
plt.figure(figsize=(15, 8))
for biomarker in top_markers:
    plt.plot(monthly_biomarkers.index, monthly_biomarkers[biomarker],
             label=biomarker, marker='o')

plt.title('Biomarker Trends over Time')
plt.xlabel('Month')
plt.ylabel('Mean Value')
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

## Best Practices {#boas-práticas}

### 1. Documentation {#1-documentação}

- **Keep a record** of every analysis performed
- **Document limitations** and assumptions
- **Use version control** for analysis code
- **Validate results** with clinical experts

### 2. Reproducibility {#2-reprodutibilidade}

- **Fixed seeds** in analyses with random steps
- **Python and package versions** recorded
- **Date and batch of the data** used in each analysis

### 3. Validation {#3-validação}

- **Always validate** results with clinical experts
- **Consider the limitations** of NLP data
- **Document uncertainties** and limitations
- **Use multiple sources** when possible
