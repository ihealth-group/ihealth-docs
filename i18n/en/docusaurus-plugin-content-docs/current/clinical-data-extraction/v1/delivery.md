---
displayed_sidebar: docsSidebar
pagination_prev: clinical-data-extraction/v1/jsonl-format
pagination_next: clinical-data-extraction/v1/analysis-guidelines
---

# Data Delivery

:::caution v1 documentation
This documentation covers extractions delivered **up to September 20, 2026**. See the [current version](/clinical-data-extraction/delivery).
:::

## Overview {#visão-geral}

The extracted data is delivered in **file batches** to make processing easier and keep the volume of information under proper control. This approach allows the data to be managed more efficiently and quality to be better controlled during delivery.

## Delivery Structure {#estrutura-de-entrega}

### Batch Organization {#organização-em-lotes}

The data is organized in batches with the following characteristics:

- **Batch size**: between 10-50 patients per file
- **Volume control**: allows efficient processing and proper validation
- **Flexibility**: the size can be adjusted to the specific needs of the project

### File Formats {#formatos-de-arquivo}

Each batch contains files in both available formats:

#### CSV Files {#arquivos-csv}

- **Naming**: `projectname_patients_part_001.csv`, `projectname_patients_part_002.csv`, etc.
- **Content**: clinical entities "flattened" in tabular form
- **Granularity**: one row per clinical entity

#### JSONL Files {#arquivos-jsonl}

- **Naming**: `projectname_patients_part_001.jsonl`, `projectname_patients_part_002.jsonl`, etc.
- **Content**: complete documents with a hierarchical structure
- **Granularity**: one line per clinical document

### Variation in the Number of Rows {#variação-no-número-de-linhas}

The number of rows in each file varies significantly because of:

- **Number of documents**: each patient may have a different number of clinical documents
- **Entity density**: documents may contain different numbers of extracted entities
- **Clinical complexity**: more complex cases tend to produce more entities

#### Example of Variation {#exemplo-de-variação}

```text
Part 001: 15 patients
├── CSV: 2,450 rows (average of 163 entities per patient)
└── JSONL: 89 lines (average of 6 documents per patient)

Part 002: 23 patients
├── CSV: 1,890 rows (average of 82 entities per patient)
└── JSONL: 156 lines (average of 7 documents per patient)
```

## Delivery Location {#local-de-entrega}

### Choosing the Location {#definição-do-local}

The upload/delivery location for the data is defined when **contracting the extraction** and may include:

- **Cloud Storage**: AWS S3, Google Cloud Storage, Azure Blob Storage
- **SFTP/Secure Transfer**: a secure server for file transfer
- **Specific platform**: according to the client's preference and infrastructure

### Access Settings {#configurações-de-acesso}

- **Credentials**: provided during the contracting process
- **Permissions**: access configured according to the project's needs
- **Security**: encrypted transfer and access logs

## Batch Processing {#processamento-dos-lotes}

### Recommended Strategies {#estratégias-recomendadas}

#### 1. Sequential Processing {#1-processamento-sequencial}

```python
import pandas as pd
import json
import glob

# Process CSV batches sequentially
csv_files = sorted(glob.glob("projectname_patients_part_*.csv"))
all_data = []

for file in csv_files:
    print(f"Processing {file}...")
    df = pd.read_csv(file)
    all_data.append(df)

# Combine all the data
combined_df = pd.concat(all_data, ignore_index=True)
print(f"Total records: {len(combined_df)}")
```

#### 2. Parallel Processing {#2-processamento-paralelo}

```python
from concurrent.futures import ThreadPoolExecutor
import glob
import pandas as pd

def process_csv_file(file_path):
    """Process a single CSV file"""
    df = pd.read_csv(file_path)
    # Add batch metadata
    # "projectname_patients_part_001.csv" -> "001"
    df['batch_id'] = file_path.split('_')[-1].split('.')[0]
    return df

# Process multiple files in parallel
csv_files = glob.glob("projectname_patients_part_*.csv")
with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(process_csv_file, csv_files))

# Combine the results
combined_df = pd.concat(results, ignore_index=True)
```

#### 3. JSONL Processing by Batch {#3-processamento-jsonl-por-lote}

```python
import glob
import json

def process_jsonl_batch(file_path):
    """Process a JSONL batch"""
    documents = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            doc = json.loads(line)
            doc['batch_id'] = file_path.split('_')[-1].split('.')[0]
            documents.append(doc)
    return documents

# Process all JSONL batches
jsonl_files = sorted(glob.glob("projectname_patients_part_*.jsonl"))
all_documents = []

for file in jsonl_files:
    print(f"Processing {file}...")
    batch_docs = process_jsonl_batch(file)
    all_documents.extend(batch_docs)

print(f"Total documents: {len(all_documents)}")
```

### Integrity Validation {#validação-de-integridade}

#### Batch Check {#verificação-de-lotes}

```python
def validate_batch_integrity(csv_file, jsonl_file):
    """Validate integrity between the CSV and JSONL files of the same batch"""

    # Load the data
    df_csv = pd.read_csv(csv_file)
    documents_jsonl = []

    with open(jsonl_file, 'r', encoding='utf-8') as f:
        for line in f:
            documents_jsonl.append(json.loads(line))

    # Checks
    csv_patients = set(df_csv['patient_id'].unique())
    jsonl_patients = set(doc['patient_id'] for doc in documents_jsonl)

    print(f"Batch {csv_file}:")
    print(f"  CSV patients: {len(csv_patients)}")
    print(f"  JSONL patients: {len(jsonl_patients)}")
    print(f"  Patients match: {csv_patients == jsonl_patients}")

    return csv_patients == jsonl_patients

# Validate all batches
csv_files = sorted(glob.glob("projectname_patients_part_*.csv"))
jsonl_files = sorted(glob.glob("projectname_patients_part_*.jsonl"))

for csv_file, jsonl_file in zip(csv_files, jsonl_files):
    validate_batch_integrity(csv_file, jsonl_file)
```

## Important Considerations {#considerações-importantes}

### 1. Batch Order {#1-ordem-dos-lotes}

- **Sequence**: batches are numbered sequentially (001, 002, 003...)
- **Independence**: each batch is independent and can be processed separately
- **Completeness**: all batches must be processed for a complete analysis

### 2. Data Quality {#2-qualidade-dos-dados}

- **Validation**: each batch goes through quality validation before delivery
- **Consistency**: the data structure is the same across all batches
- **Integrity**: integrity is checked between the CSV and JSONL formats

### 3. Security {#3-segurança}

- **Encryption**: encrypted transfer to the delivery location
- **Access**: secure credentials and access control
- **Auditing**: access and transfer logs are kept

### 4. Support {#4-suporte}

- **Documentation**: this documentation already contains all the information you need about the data and how to process it
- **Questions**: for any further questions, contact our technical team
