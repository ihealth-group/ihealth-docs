# CSV Format

This page describes the extraction's CSV file and provides Python (pandas) code examples to load, validate and analyze the data. It is intended for anyone who will work with the data in tabular form.

## Characteristics {#características}

- **Granularity**: each row corresponds to 1 clinical entity
- **Structure**: "flattened" data in columns
- **Recommended use**: analyses of individual entities and statistics by entity type

## CSV File Structure {#estrutura-do-arquivo-csv}

### Header {#cabeçalho}

```csv
document_id,document_date,patient_id,case_id,gender,birthdate,death,provider_state_code,provider_type,entity_id,entity,label,assertion,normalized_entity,specific_marker,method,detection_status,score,numeric_value,unit,relation_type,relation_entity,relation_position
```

The fields from `normalized_entity` to `unit` are the [structured fields](./data-structure.md#campos-estruturados-de-biomarcadores-e-exames) and are only filled in for `BIOMARKER` and `LAB_TEST`.

### Sample Data {#exemplo-de-dados}

Entity and `provider_type` values are in Portuguese, as in the delivered files.

```csv
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,FEMALE,1980-05-15 00:00:00,N,SP,Público,doc_123_45,câncer de mama,DISEASE,PRESENT,,,,,,,,disease_has_biomarker,HER2 3+,head
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,FEMALE,1980-05-15 00:00:00,N,SP,Público,doc_123_120,HER2 3+,BIOMARKER,,HER2,,imuno-histoquímica,POS,3+,,,disease_has_biomarker,câncer de mama,tail
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,FEMALE,1980-05-15 00:00:00,N,SP,Público,doc_123_200,plaquetas 150.000/mm³,LAB_TEST,,Plaquetas,,,,,150000.0,mm³,,,
doc_456,2023-06-15 09:30:22,patient_def456,case_uvw123,MALE,1975-03-20 00:00:00,N,MG,Convênio ou Particular,doc_456_78,metformina,PHARM_SUBSTANCE,PRESENT,,,,,,,,may_treat,diabetes,head
doc_456,2023-06-15 09:30:22,patient_def456,case_uvw123,MALE,1975-03-20 00:00:00,N,MG,Convênio ou Particular,doc_456_90,rx tórax,PROCEDURE,PRESENT,,,,,,,,procedure_has_target_anatomy,tórax,head
```

In the example, the breast cancer (_câncer de mama_) and the HER2 biomarker are linked by the `disease_has_biomarker` relation: each one appears in its own row, with the other entity in `relation_entity` and its own position in the relation in `relation_position`.

## Working with CSV {#trabalhando-com-csv}

> The examples on this page are sequential: each block uses the imports and variables (`df`, `entities`) created in the previous blocks.

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

### Biomarker and Lab Test Analysis {#análise-de-biomarcadores-e-exames}

```python
# Filter biomarkers and lab tests with a numeric value
numeric_entities = entities[entities['label'].isin(['BIOMARKER', 'LAB_TEST'])].copy()
numeric_entities['numeric_value'] = pd.to_numeric(numeric_entities['numeric_value'], errors='coerce')
numeric_entities = numeric_entities[numeric_entities['numeric_value'].notna()]

# Statistics by test and unit (the same measurement may come in different units).
# Values are per mention: the same result may repeat across several of the patient's documents.
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

# Most related entities (as tail), by relation type
related_entities = relations.groupby('relation_type')['relation_entity'].value_counts()
print(related_entities)

# One row per relation, in the same format as JSONL (head → tail)
relations_table = relations[['document_id', 'relation_type', 'entity', 'relation_entity']].rename(
    columns={'entity': 'head_entity', 'relation_entity': 'tail_entity'}
)
print(relations_table.head())
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

## Next Steps {#próximos-passos}

For analysis examples (entity distribution, temporal and geographic analyses, comorbidities and more), see [Analysis Guidelines](./analysis-guidelines.md).
