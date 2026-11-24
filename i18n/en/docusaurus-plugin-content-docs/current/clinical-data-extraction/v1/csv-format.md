---
displayed_sidebar: docsSidebar
pagination_prev: clinical-data-extraction/v1/data-structure
pagination_next: clinical-data-extraction/v1/jsonl-format
---

# CSV Format

:::caution v1 documentation
This documentation covers extractions delivered **up to September 20, 2026**. See the [current version](/clinical-data-extraction/csv-format).
:::

## Characteristics {#características}

- **Granularity**: each row = 1 clinical entity
- **Structure**: "flattened" data in columns
- **Recommended use**: analyses of individual entities, statistics by entity type

## CSV File Structure {#estrutura-do-arquivo-csv}

### Header {#cabeçalho}

```csv
document_id,document_date,patient_id,case_id,gender,birthdate,death,provider_state_code,provider_type,entity_id,entity,label,assertion,normalized_entity,specific_marker,detection_status,condition,numeric_value,unit,loinc_code,terminology,term_code,term_desc,relation_type,relation_entity,relation_position
```

### Sample Data {#exemplo-de-dados}

Entity, `assertion`, `term_desc` and `provider_type` values are in Portuguese, as in the delivered files.

```csv
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,MALE,1980-05-15 00:00:00,N,SP,Público,doc_123_45,hipertensão,DISEASE,PRESENTE,,,,,,,,CID-10,I10,Hipertensão arterial essencial,,,
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,MALE,1980-05-15 00:00:00,N,SP,Público,doc_123_120,HER2 positivo,BIOMARKER,,HER2,,POS,,,,48676-1,,,,,,
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,MALE,1980-05-15 00:00:00,N,SP,Público,doc_123_200,plaquetas 150.000/mm³,LAB_TEST,,Plaquetas,,,,150000.0,mm³,,,,,,,
doc_456,2023-06-15 09:30:22,patient_def456,case_uvw123,FEMALE,1975-03-20 00:00:00,N,MG,Convênio ou Particular,doc_456_78,metformina,PHARM_SUBSTANCE,PRESENTE,,,,,,,,ATC,A10BA02,Metformina,may_treat,diabetes,head
doc_456,2023-06-15 09:30:22,patient_def456,case_uvw123,FEMALE,1975-03-20 00:00:00,N,MG,Convênio ou Particular,doc_456_90,rx toráx,PROCEDURE,PRESENTE,,,,,,,,TUSS,31001001,Radiografia de tórax,procedure_has_target_anatomy,tórax,head
```

## Working with CSV {#trabalhando-com-csv}

### Loading Data {#carregando-dados}

```python
import pandas as pd

# Load the CSV file
df = pd.read_csv('extracted_data.csv')

# Check the structure
print(df.info())
print(df.head())
```

### Cleaning and Validation {#limpeza-e-validação}

```python
# Drop rows with an empty document_id
df = df[df['document_id'].notna()]

# Convert dates
df['document_date'] = pd.to_datetime(df['document_date'])
df['birthdate'] = pd.to_datetime(df['birthdate'])

# An entity with more than one relation appears in more than one row (same entity_id).
# To count entities, use one row per entity_id.
entities = df.drop_duplicates('entity_id')

# Check unique values
print("Available labels:", entities['label'].unique())
```

### Basic Analyses {#análises-básicas}

#### Entity Distribution {#distribuição-de-entidades}

```python
# Distribution by entity type
entity_distribution = entities['label'].value_counts()
print(entity_distribution)

# Most frequent entities
top_entities = entities['entity'].value_counts().head(20)
print(top_entities)
```

#### Temporal Analysis {#análise-temporal}

```python
# Documents per month
df['month'] = df['document_date'].dt.to_period('M')
monthly_docs = df.groupby('month')['document_id'].nunique()
print(monthly_docs)
```

#### Geographic Analysis {#análise-geográfica}

```python
# Patients by state (each row is an entity, so count distinct patients).
# A patient seen in more than one state is counted in each of them.
patients_by_state = df.groupby('provider_state_code')['patient_id'].nunique().sort_values(ascending=False)
print(patients_by_state)
```

### Biomarker and Lab Test Analysis {#análise-de-biomarcadores-e-exames}

```python
# Filter biomarkers and lab tests with a numeric value
numeric_entities = entities[entities['label'].isin(['BIOMARKER', 'LAB_TEST', 'CLINICAL_ATT'])].copy()
numeric_entities['numeric_value'] = pd.to_numeric(numeric_entities['numeric_value'], errors='coerce')
numeric_entities = numeric_entities[numeric_entities['numeric_value'].notna()]

# Statistics by test and unit (the same measurement may come in different units)
biomarker_stats = numeric_entities.groupby(['normalized_entity', 'unit'], dropna=False)['numeric_value'].describe()
print(biomarker_stats)
```

### Relation Analysis {#análise-de-relações}

```python
# Each relation appears in two rows (one for the head entity and one for the tail).
# To count relations, use only the head rows.
relations = df[df['relation_position'] == 'head']

# Most common relations
relation_types = relations['relation_type'].value_counts()
print(relation_types)

# Most related entities (as tail)
related_entities = relations['relation_entity'].value_counts()
print(related_entities)
```

## Important Considerations {#considerações-importantes}

### 1. Multiple Rows per Document {#1-múltiplas-linhas-por-documento}

- A document can produce several rows (one for each entity)
- Use `document_id` to group entities from the same document

### 2. Empty Fields {#2-campos-vazios}

- Not every entity has all fields filled in
- In the file, empty fields are blank. When loaded with pandas, they become `NaN`: use `.isna()` and `.notna()` to check them
- Validate that the data is present before analyzing it

### 3. Relations {#3-relações}

- An entity with more than one relation appears in one row per relation, with the same `entity_id`
- Each relation appears in two rows: the `head` entity's row and the `tail` entity's row (`relation_position`)
- To count entities, drop duplicates by `entity_id`; to count relations, use only the rows with `relation_position == 'head'`

### 4. Aggregations {#4-agregações}

```python
# Group by document
doc_entities = df.groupby('document_id').agg({
    'entity_id': 'nunique',
    'label': lambda x: list(x.unique()),
    'patient_id': 'first'
})

# Count entities per document
entities_per_doc = df.groupby('document_id')['entity_id'].nunique()
```

## Complete Analysis Example {#exemplo-de-análise-completa}

```python
import pandas as pd
import matplotlib.pyplot as plt

# Load the data
df = pd.read_csv('extracted_data.csv')

# Distribution analysis
plt.figure(figsize=(12, 6))
df.drop_duplicates('entity_id')['label'].value_counts().plot(kind='bar')
plt.title('Entity Distribution by Type')
plt.xlabel('Entity Type')
plt.ylabel('Count')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Temporal analysis
df['document_date'] = pd.to_datetime(df['document_date'])
df['month'] = df['document_date'].dt.to_period('M')
monthly_trend = df.groupby('month')['document_id'].nunique()

plt.figure(figsize=(12, 6))
monthly_trend.plot(kind='line', marker='o')
plt.title('Documents per Month')
plt.xlabel('Month')
plt.ylabel('Number of Documents')
plt.tight_layout()
plt.show()
```
