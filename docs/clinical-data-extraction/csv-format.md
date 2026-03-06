# Formato CSV

## Características

- **Granularidade**: Cada linha = 1 entidade clínica
- **Estrutura**: Dados "achatados" em colunas
- **Uso recomendado**: Análises de entidades individuais, estatísticas por tipo de entidade

## Estrutura do Arquivo CSV

### Cabeçalho

```csv
document_id,document_date,patient_id,case_id,gender,birthdate,death,provider_state_code,provider_type,entity_id,entity,label,assertion,normalized_entity,specific_marker,detection_status,condition,numeric_value,unit,loinc_code,terminology,term_code,term_desc,relation_type,relation_entity,relation_position
```

### Exemplo de Dados

```csv
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,MALE,1980-05-15 00:00:00,N,SP,Público,doc_123_45,hipertensão,DISEASE,PRESENTE,,,,,,,,CID-10,I10,Hipertensão arterial essencial,,,
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,MALE,1980-05-15 00:00:00,N,SP,Público,doc_123_120,HER2 positivo,BIOMARKER,,HER2,HER2,positivo,,,33747-0,,,,,,
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,MALE,1980-05-15 00:00:00,N,SP,Público,doc_123_200,plaquetas 150.000/mm³,LAB_TEST,,Plaquetas,,,,150000.0,mm³,,,,,,
doc_456,2023-06-15 09:30:22,patient_def456,case_uvw123,FEMALE,1975-03-20 00:00:00,N,MG,Convênio ou Particular,doc_456_78,metformina,PHARM_SUBSTANCE,PRESENTE,,,,,,,,ATC,A10BA02,Metformina,may_treat,diabetes,head
doc_456,2023-06-15 09:30:22,patient_def456,case_uvw123,FEMALE,1975-03-20 00:00:00,N,MG,Convênio ou Particular,doc_456_90,rx toráx,PROCEDURE,PRESENTE,,,,,,,,TUSS,31001001,Radiografia de tórax,procedure_has_target_anatomy,tórax,head
```

## Trabalhando com CSV

### Carregando Dados

```python
import pandas as pd

# Carregar arquivo CSV
df = pd.read_csv('dados_extraidos.csv')

# Verificar estrutura
print(df.info())
print(df.head())
```

### Limpeza e Validação

```python
# Remover linhas com document_id vazio
df = df[df['document_id'].notna()]

# Converter datas
df['document_date'] = pd.to_datetime(df['document_date'])
df['birthdate'] = pd.to_datetime(df['birthdate'])

# Verificar valores únicos
print("Labels disponíveis:", df['label'].unique())
```

### Análises Básicas

#### Distribuição de Entidades

```python
# Distribuição por tipo de entidade
entity_distribution = df['label'].value_counts()
print(entity_distribution)

# Entidades mais frequentes
top_entities = df['entity'].value_counts().head(20)
print(top_entities)
```

#### Análise Temporal

```python
# Documentos por mês
df['month'] = df['document_date'].dt.to_period('M')
monthly_docs = df.groupby('month')['document_id'].nunique()
print(monthly_docs)
```

#### Análise Geográfica

```python
# Distribuição por região
region_distribution = df['provider_state_code'].value_counts()
print(region_distribution)
```

### Análise de Biomarcadores e Exames

```python
# Filtrar apenas entidades com valores numéricos
numeric_entities = df[
    (df['label'].isin(['BIOMARKER', 'LAB_TEST', 'CLINICAL_ATT'])) &
    (df['numeric_value'] != '') &
    (df['numeric_value'].notna())
].copy()

# Converter valores numéricos
numeric_entities['numeric_value'] = pd.to_numeric(numeric_entities['numeric_value'])

# Estatísticas por tipo de exame
biomarker_stats = numeric_entities.groupby('normalized_entity')['numeric_value'].describe()
print(biomarker_stats)
```

### Análise de Relações

```python
# Relações mais comuns
relation_types = df[df['relation_type'] != '']['relation_type'].value_counts()
print(relation_types)

# Entidades mais relacionadas
related_entities = df[df['relation_entity'] != '']['relation_entity'].value_counts()
print(related_entities)
```

## Considerações Importantes

### 1. Múltiplas Linhas por Documento

- Um documento pode gerar várias linhas (uma para cada entidade)
- Use `document_id` para agrupar entidades do mesmo documento

### 2. Campos Vazios

- Nem todas as entidades possuem todos os campos preenchidos
- Campos vazios são representados como strings vazias ("")
- Valide a presença de dados antes de análises

### 3. Relações

- Entidades com relações geram linhas adicionais
- Use `relation_type` e `relation_entity` para análise de relacionamentos

### 4. Agregações

```python
# Agrupar por documento
doc_entities = df.groupby('document_id').agg({
    'entity_id': 'count',
    'label': lambda x: list(x.unique()),
    'patient_id': 'first'
})

# Contar entidades por documento
entities_per_doc = df.groupby('document_id')['entity_id'].count()
```

## Exemplo de Análise Completa

```python
import pandas as pd
import matplotlib.pyplot as plt

# Carregar dados
df = pd.read_csv('dados_extraidos.csv')

# Análise de distribuição
plt.figure(figsize=(12, 6))
df['label'].value_counts().plot(kind='bar')
plt.title('Distribuição de Entidades por Tipo')
plt.xlabel('Tipo de Entidade')
plt.ylabel('Quantidade')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Análise temporal
df['document_date'] = pd.to_datetime(df['document_date'])
df['month'] = df['document_date'].dt.to_period('M')
monthly_trend = df.groupby('month')['document_id'].nunique()

plt.figure(figsize=(12, 6))
monthly_trend.plot(kind='line', marker='o')
plt.title('Tendência de Documentos por Mês')
plt.xlabel('Mês')
plt.ylabel('Número de Documentos')
plt.tight_layout()
plt.show()
```

---

**Anterior**: [Entrega dos Dados](./delivery.md)  
**Próximo**: [Formato JSONL](./jsonl-format.md)
