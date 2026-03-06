# Diretrizes para Análise de Dados

## Contexto dos Dados

Esta documentação fornece diretrizes para análise dos **dados extraídos** de nosso banco clínico. Estes dados representam uma seleção específica de documentos médicos de nossa base, com ampla cobertura nacional e representatividade para análises, filtrados conforme critérios definidos para o projeto.

### Características Importantes dos Dados Extraídos

- **Origem**: Banco de dados clínico com ampla cobertura e representatividade para estudos e projetos
- **Seleção**: Pacientes e documentos filtrados por critérios específicos (diagnósticos, medicamentos, procedimentos, etc.)
- **Estruturação**: Dados processados com NLP para extração de entidades clínicas
- **Anonimização**: Identificadores de pacientes e provedores anonimizados
- **Formatos**: Disponibilizados em CSV e JSONL para diferentes tipos de análise

## Preparação dos Dados

### Limpeza e Validação

#### Para CSV

```python
import pandas as pd

# Carregar dados extraídos em formato CSV
df = pd.read_csv('dados_extraidos.csv')

# Remover linhas com document_id vazio
df = df[df['document_id'].notna()]

# Converter datas
df['document_date'] = pd.to_datetime(df['document_date'])
df['birthdate'] = pd.to_datetime(df['birthdate'])

# Verificar estrutura
print("Shape:", df.shape)
print("Colunas:", df.columns.tolist())
print("Tipos de dados:", df.dtypes)
```

#### Para JSONL

```python
import json

# Carregar dados extraídos em formato JSONL
data = []
with open('dados_extraidos.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data.append(json.loads(line))

print(f"Total de documentos: {len(data)}")

# Verificar estrutura do primeiro documento
if data:
    print("Estrutura do primeiro documento:")
    print(json.dumps(data[0], indent=2, ensure_ascii=False))
```

### Tratamento de Valores Ausentes

- **Campos vazios**: Representados como strings vazias ("")
- **Valores numéricos ausentes**: Campo `numeric_value` vazio
- **Códigos de terminologia**: Podem estar ausentes
- **Relações**: Nem todas as entidades possuem relações

```python
# Verificar valores ausentes
print("Valores ausentes por coluna:")
print(df.isnull().sum())

# Verificar campos vazios (strings vazias)
empty_fields = {}
for col in df.columns:
    empty_count = (df[col] == '').sum()
    if empty_count > 0:
        empty_fields[col] = empty_count

print("Campos vazios:")
for field, count in empty_fields.items():
    print(f"  {field}: {count}")
```

## Análises Recomendadas

### 1. Análise Descritiva

#### Distribuição de Entidades

```python
# Distribuição por tipo de entidade
entity_distribution = df['label'].value_counts()
print("Distribuição de entidades:")
print(entity_distribution)

# Visualização
import matplotlib.pyplot as plt
plt.figure(figsize=(12, 6))
entity_distribution.plot(kind='bar')
plt.title('Distribuição de Entidades por Tipo')
plt.xlabel('Tipo de Entidade')
plt.ylabel('Quantidade')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

#### Entidades Mais Frequentes

```python
# Top 20 entidades mais frequentes
top_entities = df['entity'].value_counts().head(20)
print("Entidades mais frequentes:")
print(top_entities)

# Entidades por categoria
for label in df['label'].unique():
    if pd.notna(label):
        print(f"\n{label}:")
        top_in_category = df[df['label'] == label]['entity'].value_counts().head(10)
        print(top_in_category)
```

### 2. Análise Temporal

```python
# Análise temporal
df['document_date'] = pd.to_datetime(df['document_date'])
df['month'] = df['document_date'].dt.to_period('M')
df['year'] = df['document_date'].dt.year

# Documentos por mês
monthly_docs = df.groupby('month')['document_id'].nunique()
print("Documentos por mês:")
print(monthly_docs)

# Tendência temporal
plt.figure(figsize=(12, 6))
monthly_docs.plot(kind='line', marker='o')
plt.title('Tendência de Documentos por Mês')
plt.xlabel('Mês')
plt.ylabel('Número de Documentos')
plt.tight_layout()
plt.show()
```

### 3. Análise Geográfica

```python
# Distribuição por região
region_distribution = df['provider_state_code'].value_counts()
print("Distribuição por UF:")
print(region_distribution)
```

### 4. Análise de Relações

```python
# Relações mais comuns
relation_types = df[df['relation_type'] != '']['relation_type'].value_counts()
print("Tipos de relação mais comuns:")
print(relation_types)

# Entidades mais relacionadas
related_entities = df[df['relation_entity'] != '']['relation_entity'].value_counts()
print("Entidades mais relacionadas:")
print(related_entities.head(20))
```

## Análises Específicas

### 1. Análise de Biomarcadores

```python
# Filtrar apenas biomarcadores com valores numéricos
biomarkers = df[
    (df['label'].isin(['BIOMARKER', 'LAB_TEST', 'CLINICAL_ATT'])) &
    (df['numeric_value'] != '') &
    (df['numeric_value'].notna())
].copy()

# Converter valores numéricos
biomarkers['numeric_value'] = pd.to_numeric(biomarkers['numeric_value'])

# Estatísticas por biomarcador
biomarker_stats = biomarkers.groupby('normalized_entity')['numeric_value'].describe()
print("Estatísticas por biomarcador:")
print(biomarker_stats)

# Análise por status de detecção
detection_analysis = df[
    df['label'].isin(['BIOMARKER', 'LAB_TEST'])
].groupby(['normalized_entity', 'detection_status']).size().unstack(fill_value=0)

print("Análise por status de detecção:")
print(detection_analysis)
```

### 2. Análise de Comorbidades

```python
# Identificar pacientes com múltiplas condições
patient_conditions = df.groupby('patient_id')['entity'].apply(list)
comorbidities = patient_conditions[patient_conditions.apply(len) > 1]

print(f"Pacientes com múltiplas condições: {len(comorbidities)}")

# Análise de padrões de comorbidade
comorbidity_patterns = {}
for patient, conditions in comorbidities.items():
    conditions_set = set(conditions)
    if len(conditions_set) > 1:
        pattern = tuple(sorted(conditions_set))
        if pattern not in comorbidity_patterns:
            comorbidity_patterns[pattern] = 0
        comorbidity_patterns[pattern] += 1

# Padrões mais comuns
common_patterns = sorted(comorbidity_patterns.items(), key=lambda x: x[1], reverse=True)
print("Padrões de comorbidade mais comuns:")
for pattern, count in common_patterns[:10]:
    print(f"  {pattern}: {count} pacientes")
```

### 3. Análise de Padrões de Tratamento

```python
# Relacionar medicamentos a condições
treatment_patterns = df[
    (df['label'] == 'PHARM_SUBSTANCE') &
    (df['relation_type'] == 'may_treat')
].groupby(['entity', 'relation_entity']).size().sort_values(ascending=False)

print("Padrões de tratamento mais comuns:")
print(treatment_patterns.head(20))
```

### 4. Análise de Qualidade dos Dados

```python
# Verificar consistência entre entity e normalized_entity
inconsistent_entities = df[
    (df['normalized_entity'] != '') &
    (df['entity'] != df['normalized_entity'])
][['entity', 'normalized_entity', 'label']].drop_duplicates()

print("Entidades com normalização:")
print(inconsistent_entities.head(10))

# Verificar códigos de terminologia
terminology_coverage = df[
    df['terminology'] != ''
].groupby('label')['terminology'].value_counts()

print("Cobertura de terminologia por categoria:")
print(terminology_coverage)
```

## Considerações Específicas

### 1. Anonimização

- **IDs de pacientes e casos**: Anonimizados para preservar privacidade
- **Preservação de privacidade**: Mantenha confidencialidade em todas as análises

```python
# Verificar anonimização
print("Exemplos de IDs anonimizados:")
print("Patient IDs:", df['patient_id'].unique()[:5])
print("Case IDs:", df['case_id'].unique()[:5])
```

### 2. Qualidade dos Dados

```python
# Verificar consistência
print("Verificações de qualidade:")

# 1. Documentos sem entidades
docs_without_entities = df.groupby('document_id').size()
empty_docs = docs_without_entities[docs_without_entities == 0]
print(f"Documentos sem entidades: {len(empty_docs)}")

# 2. Entidades sem assertion
entities_without_assertion = df[df['assertion'] == ''].shape[0]
print(f"Entidades sem assertion: {entities_without_assertion}")

# 3. Relações órfãs
orphan_relations = df[
    (df['relation_type'] != '') &
    (df['relation_entity'] == '')
].shape[0]
print(f"Relações órfãs: {orphan_relations}")
```

### 3. Contexto Clínico

```python
# Análise por documento
doc_analysis = df.groupby('document_id').agg({
    'entity_id': 'count',
    'label': lambda x: list(x.unique()),
    'patient_id': 'first'
})

print("Análise por documento:")
print(doc_analysis.head())

# Documentos com mais entidades
richest_docs = doc_analysis.sort_values('entity_id', ascending=False)
print("Documentos com mais entidades:")
print(richest_docs.head(10))
```

## Exemplos de Análises Avançadas

### 1. Análise de Correlação

```python
# Correlação entre biomarcadores (exemplo)
biomarker_correlation = biomarkers.pivot_table(
    index='patient_id',
    columns='normalized_entity',
    values='numeric_value',
    aggfunc='mean'
).corr()

# Visualizar correlação
import seaborn as sns
plt.figure(figsize=(10, 8))
sns.heatmap(biomarker_correlation, annot=True, cmap='coolwarm', center=0)
plt.title('Correlação entre Biomarcadores')
plt.tight_layout()
plt.show()
```

### 2. Análise de Clusters

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Preparar dados para clustering
biomarker_pivot = biomarkers.pivot_table(
    index='patient_id',
    columns='normalized_entity',
    values='numeric_value',
    aggfunc='mean'
).fillna(0)

# Normalizar dados
scaler = StandardScaler()
biomarker_scaled = scaler.fit_transform(biomarker_pivot)

# Aplicar K-means
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(biomarker_scaled)

# Adicionar clusters ao DataFrame
biomarker_pivot['cluster'] = clusters
print("Distribuição de clusters:")
print(biomarker_pivot['cluster'].value_counts())
```

### 3. Análise de Séries Temporais

```python
# Análise temporal de biomarcadores
temporal_biomarkers = biomarkers.copy()
temporal_biomarkers['date'] = pd.to_datetime(temporal_biomarkers['document_date'])

# Agrupar por mês e biomarcador
monthly_biomarkers = temporal_biomarkers.groupby([
    temporal_biomarkers['date'].dt.to_period('M'),
    'normalized_entity'
])['numeric_value'].mean().unstack()

# Visualizar tendências
plt.figure(figsize=(15, 8))
for biomarker in monthly_biomarkers.columns[:5]:  # Top 5 biomarcadores
    plt.plot(monthly_biomarkers.index, monthly_biomarkers[biomarker],
             label=biomarker, marker='o')

plt.title('Tendências Temporais de Biomarcadores')
plt.xlabel('Mês')
plt.ylabel('Valor Médio')
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

## Boas Práticas

### 1. Documentação

- **Mantenha registro** de todas as análises realizadas
- **Documente limitações** e suposições
- **Use versionamento** para código de análise
- **Valide resultados** com especialistas clínicos

### 2. Reprodutibilidade

```python
# Configurar seed para reprodutibilidade
import random
import numpy as np

RANDOM_SEED = 42
random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

# Salvar configurações
config = {
    'random_seed': RANDOM_SEED,
    'data_version': 'v1.0',
    'analysis_date': pd.Timestamp.now().strftime('%Y-%m-%d'),
    'python_version': '3.8+'
}

print("Configurações da análise:")
for key, value in config.items():
    print(f"  {key}: {value}")
```

### 3. Validação

- **Sempre valide** resultados com especialistas clínicos
- **Considere limitações** dos dados de PLN
- **Documente incertezas** e limitações
- **Use múltiplas fontes** quando possível

---

**Anterior**: [Formato JSONL](./jsonl-format.md)  
**Próximo**: [Limitações](./limitations.md)
