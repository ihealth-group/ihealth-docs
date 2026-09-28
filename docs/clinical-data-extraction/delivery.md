# Entrega dos Dados

Esta página explica como os arquivos da extração são organizados e entregues, e traz exemplos de código para processar os lotes. É indicada para quem vai receber os arquivos e montar o carregamento dos dados.

## Visão Geral

Os dados extraídos são entregues em **lotes de arquivos**, o que facilita o processamento e o controle do volume de informações. Essa abordagem permite gerenciar os dados com mais eficiência e controlar melhor a qualidade durante a entrega.

## Estrutura de Entrega

### Organização em Lotes

Os dados são organizados em lotes com as seguintes características:

- **Tamanho do lote**: Entre 10-50 pacientes por arquivo
- **Controle de volume**: Permite processamento eficiente e validação adequada
- **Flexibilidade**: Tamanho pode ser ajustado conforme necessidades específicas do projeto

### Formatos de Arquivo

Cada lote contém arquivos nos dois formatos disponíveis:

#### Arquivos CSV

- **Nomenclatura**: `projectname_patients_part_001.csv`, `projectname_patients_part_002.csv`, etc.
- **Conteúdo**: Entidades clínicas "achatadas" em formato tabular
- **Granularidade**: Uma linha por entidade clínica

#### Arquivos JSONL

- **Nomenclatura**: `projectname_patients_part_001.jsonl`, `projectname_patients_part_002.jsonl`, etc.
- **Conteúdo**: Documentos completos com estrutura hierárquica
- **Granularidade**: Uma linha por documento clínico

### Variação no Número de Linhas

O número de linhas em cada arquivo varia significativamente devido a:

- **Quantidade de documentos**: Cada paciente pode ter diferentes números de documentos clínicos
- **Densidade de entidades**: Documentos podem conter diferentes quantidades de entidades extraídas
- **Complexidade clínica**: Casos mais complexos tendem a gerar mais entidades

#### Exemplo de Variação

```text
Parte 001: 15 pacientes
├── CSV: 2.450 linhas (média de 163 entidades por paciente)
└── JSONL: 89 linhas (média de 6 documentos por paciente)

Parte 002: 23 pacientes
├── CSV: 1.890 linhas (média de 82 entidades por paciente)
└── JSONL: 156 linhas (média de 7 documentos por paciente)
```

## Local de Entrega

### Definição do Local

O local de upload/entrega dos dados é definido durante a **contratação da extração** e pode incluir:

- **Cloud Storage**: AWS S3, Google Cloud Storage, Azure Blob Storage
- **SFTP/Secure Transfer**: Servidor seguro para transferência de arquivos
- **Plataforma específica**: Conforme preferência e infraestrutura do cliente

### Configurações de Acesso

- **Credenciais**: Fornecidas durante o processo de contratação
- **Permissões**: Acesso configurado conforme necessidades do projeto
- **Segurança**: Transferência criptografada e logs de acesso

## Processamento dos Lotes

### Estratégias Recomendadas

#### 1. Processamento Sequencial

```python
import pandas as pd
import json
import glob

# Processar lotes CSV sequencialmente
csv_files = sorted(glob.glob("projectname_patients_part_*.csv"))
all_data = []

for file in csv_files:
    print(f"Processando {file}...")
    df = pd.read_csv(file)
    # Identificar o lote: "projectname_patients_part_001.csv" -> "001"
    df['lote_id'] = file.split('_')[-1].split('.')[0]
    all_data.append(df)

# Combinar todos os dados
combined_df = pd.concat(all_data, ignore_index=True)
print(f"Total de registros: {len(combined_df)}")
```

#### 2. Processamento Paralelo

```python
from concurrent.futures import ThreadPoolExecutor
import glob
import pandas as pd

def process_csv_file(file_path):
    """Processa um arquivo CSV individual"""
    df = pd.read_csv(file_path)
    # Adicionar metadados do lote
    # "projectname_patients_part_001.csv" -> "001"
    df['lote_id'] = file_path.split('_')[-1].split('.')[0]
    return df

# Processar múltiplos arquivos em paralelo
csv_files = glob.glob("projectname_patients_part_*.csv")
with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(process_csv_file, csv_files))

# Combinar resultados
combined_df = pd.concat(results, ignore_index=True)
```

#### 3. Processamento JSONL por Lote

```python
import glob
import json

def process_jsonl_batch(file_path):
    """Processa um lote JSONL"""
    documents = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            doc = json.loads(line)
            doc['lote_id'] = file_path.split('_')[-1].split('.')[0]
            documents.append(doc)
    return documents

# Processar todos os lotes JSONL
jsonl_files = sorted(glob.glob("projectname_patients_part_*.jsonl"))
all_documents = []

for file in jsonl_files:
    print(f"Processando {file}...")
    batch_docs = process_jsonl_batch(file)
    all_documents.extend(batch_docs)

print(f"Total de documentos: {len(all_documents)}")
```

### Validação de Integridade

#### Verificação de Lotes

```python
import glob
import json
import pandas as pd

def validate_batch_integrity(csv_file, jsonl_file):
    """Valida integridade entre arquivos CSV e JSONL do mesmo lote"""

    # Carregar dados
    df_csv = pd.read_csv(csv_file)
    documents_jsonl = []

    with open(jsonl_file, 'r', encoding='utf-8') as f:
        for line in f:
            documents_jsonl.append(json.loads(line))

    # Verificações
    csv_patients = set(df_csv['patient_id'].unique())
    jsonl_patients = set(doc['patient_id'] for doc in documents_jsonl)

    print(f"Lote {csv_file}:")
    print(f"  Pacientes CSV: {len(csv_patients)}")
    print(f"  Pacientes JSONL: {len(jsonl_patients)}")
    print(f"  Pacientes coincidem: {csv_patients == jsonl_patients}")

    return csv_patients == jsonl_patients

# Validar todos os lotes
csv_files = sorted(glob.glob("projectname_patients_part_*.csv"))
jsonl_files = sorted(glob.glob("projectname_patients_part_*.jsonl"))

for csv_file, jsonl_file in zip(csv_files, jsonl_files):
    validate_batch_integrity(csv_file, jsonl_file)
```

## Considerações Importantes

### 1. Ordem dos Lotes

- **Sequência**: Os lotes são numerados sequencialmente (001, 002, 003...)
- **Independência**: Cada lote é independente e pode ser processado separadamente
- **Completude**: Todos os lotes devem ser processados para análise completa

### 2. Qualidade dos Dados

- **Validação**: Cada lote passa por validação de qualidade antes da entrega
- **Consistência**: Estrutura de dados mantida entre todos os lotes
- **Integridade**: Verificação de integridade entre formatos CSV e JSONL

### 3. Segurança

- **Criptografia**: Transferência criptografada para o local de entrega
- **Acesso**: Credenciais seguras e controle de acesso
- **Auditoria**: Logs de acesso e transferência mantidos

### 4. Suporte

- **Documentação**: Esta documentação já contém todas as informações necessárias sobre os dados e como processá-los
- **Dúvidas**: Para qualquer dúvida adicional, entre em contato com nossa equipe técnica
