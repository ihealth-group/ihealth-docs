# Entrega dos Dados

## Visão Geral

Os dados extraídos são entregues em **lotes de arquivos** para facilitar o processamento e controle adequado do volume de informações. Esta abordagem permite um gerenciamento mais eficiente dos dados e melhor controle de qualidade durante o processo de entrega.

## Estrutura de Entrega

### Organização em Lotes

Os dados são organizados em lotes com as seguintes características:

- **Tamanho do lote**: Entre 10-50 pacientes por arquivo
- **Controle de volume**: Permite processamento eficiente e validação adequada
- **Flexibilidade**: Tamanho pode ser ajustado conforme necessidades específicas do projeto

### Formatos de Arquivo

Cada lote contém arquivos nos dois formatos disponíveis:

#### 📊 Arquivos CSV

- **Nomenclatura**: `projectname_patients_part_001.csv`, `projectname_patients_part_002.csv`, etc.
- **Conteúdo**: Entidades clínicas "achatadas" em formato tabular
- **Granularidade**: Uma linha por entidade clínica

#### 📋 Arquivos JSONL

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
    all_data.append(df)

# Combinar todos os dados
combined_df = pd.concat(all_data, ignore_index=True)
print(f"Total de registros: {len(combined_df)}")
```

#### 2. Processamento Paralelo

```python
from concurrent.futures import ThreadPoolExecutor
import pandas as pd

def process_csv_file(file_path):
    """Processa um arquivo CSV individual"""
    df = pd.read_csv(file_path)
    # Adicionar metadados do lote
    df['lote_id'] = file_path.split('_')[1]
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
import json

def process_jsonl_batch(file_path):
    """Processa um lote JSONL"""
    documents = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            doc = json.loads(line)
            doc['lote_id'] = file_path.split('_')[1]
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

## Estratégias de Processamento

#### 1. Processamento Incremental

```python
def process_incremental_batches(batch_size=5):
    """Processa lotes em grupos menores para economizar memória"""

    csv_files = sorted(glob.glob("projectname_patients_part_*.csv"))

    for i in range(0, len(csv_files), batch_size):
        batch_files = csv_files[i:i+batch_size]
        print(f"Processando lotes {i+1} a {min(i+batch_size, len(csv_files))}")

        # Processar lote
        batch_data = []
        for file in batch_files:
            df = pd.read_csv(file)
            batch_data.append(df)

        combined_batch = pd.concat(batch_data, ignore_index=True)

        # Salvar resultado intermediário
        output_file = f"processado_lotes_{i+1}_{min(i+batch_size, len(csv_files))}.csv"
        combined_batch.to_csv(output_file, index=False)

        print(f"Salvo: {output_file} ({len(combined_batch)} registros)")
```

#### 2. Processamento com Chunking

```python
def process_large_csv_with_chunks(file_path, chunk_size=10000):
    """Processa arquivos CSV grandes usando chunks"""

    results = []

    for chunk in pd.read_csv(file_path, chunksize=chunk_size):
        # Processar chunk
        processed_chunk = chunk.copy()
        processed_chunk['processed_date'] = pd.Timestamp.now()

        results.append(processed_chunk)

        # Salvar progresso
        if len(results) % 10 == 0:
            print(f"Processados {len(results) * chunk_size} registros...")

    return pd.concat(results, ignore_index=True)
```

## Monitoramento e Logs

### Rastreamento de Processamento

```python
import logging
from datetime import datetime

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('processamento_lotes.log'),
        logging.StreamHandler()
    ]
)

def process_batch_with_logging(file_path):
    """Processa lote com logging detalhado"""

    start_time = datetime.now()
    logging.info(f"Iniciando processamento: {file_path}")

    try:
        # Processar arquivo
        df = pd.read_csv(file_path)

        # Log de estatísticas
        logging.info(f"Registros carregados: {len(df)}")
        logging.info(f"Pacientes únicos: {df['patient_id'].nunique()}")
        logging.info(f"Documentos únicos: {df['document_id'].nunique()}")

        # Processar dados
        # ... código de processamento ...

        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        logging.info(f"Processamento concluído em {duration:.2f} segundos")

    except Exception as e:
        logging.error(f"Erro no processamento de {file_path}: {str(e)}")
        raise
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

---

**Anterior**: [Diretrizes de Análise](./analysis-guidelines.md)  
**Próximo**: [Limitações](./limitations.md)
