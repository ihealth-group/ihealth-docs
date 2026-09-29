---
displayed_sidebar: docsSidebar
pagination_prev: clinical-data-extraction/v1/delivery
pagination_next: clinical-data-extraction/v1/limitations
---

# Diretrizes para Análise de Dados

:::caution Documentação v1
Esta documentação corresponde às extrações entregues **até 20/09/2026**. Consulte a [versão atual](../analysis-guidelines.md).
:::

## Contexto dos Dados

Esta documentação fornece diretrizes para análise dos **dados extraídos** de nosso banco clínico. Estes dados representam uma seleção específica de documentos médicos de nossa base, com ampla cobertura nacional e representatividade para análises, filtrados conforme critérios definidos para o projeto.

### Características Importantes dos Dados Extraídos

- **Origem**: Banco de dados clínico com ampla cobertura e representatividade para estudos e projetos
- **Seleção**: Pacientes e documentos filtrados por critérios específicos (diagnósticos, medicamentos, procedimentos, etc.)
- **Estruturação**: Dados processados com Processamento de Linguagem Natural (PLN) para extração de entidades clínicas
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

# Uma entidade com mais de uma relação aparece em mais de uma linha (mesmo entity_id).
# Para contar entidades, use uma linha por entity_id.
entities = df.drop_duplicates('entity_id')

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

- **Campos vazios**: ficam em branco no CSV e viram `NaN` ao carregar com pandas
- **Valores numéricos ausentes**: Campo `numeric_value` vazio
- **Códigos de terminologia**: Podem estar ausentes
- **Relações**: Nem todas as entidades possuem relações

```python
# Verificar campos vazios por coluna
print("Campos vazios por coluna:")
print(df.isna().sum())
```

## Análises Recomendadas

### 1. Análise Descritiva

#### Distribuição de Entidades

```python
# Distribuição por tipo de entidade
entity_distribution = entities['label'].value_counts()
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
# Desconsiderar menções negadas
patient_entities = entities[~entities['assertion'].isin(['AUSENTE'])]

# Top 20 entidades mais frequentes
top_entities = patient_entities['entity'].value_counts().head(20)
print("Entidades mais frequentes:")
print(top_entities)

# Entidades por categoria
for label in patient_entities['label'].dropna().unique():
    print(f"\n{label}:")
    top_in_category = patient_entities[patient_entities['label'] == label]['entity'].value_counts().head(10)
    print(top_in_category)
```

#### Contexto das Entidades

```python
# Quantidade de menções por categoria e contexto (assertion)
print(pd.crosstab(entities['label'], entities['assertion']))
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
# Pacientes por UF (cada linha é uma entidade, então conte pacientes distintos).
# Um paciente atendido em mais de uma UF é contado em cada uma delas.
patients_by_state = df.groupby('provider_state_code')['patient_id'].nunique().sort_values(ascending=False)
print("Pacientes por UF:")
print(patients_by_state)
```

### 4. Análise de Relações

```python
# Cada relação aparece em duas linhas (uma da entidade head e outra da tail).
# Para contar relações, use só as linhas da head.
relations = df[df['relation_position'] == 'head']

# Relações mais comuns
relation_types = relations['relation_type'].value_counts()
print("Tipos de relação mais comuns:")
print(relation_types)

# Entidades mais relacionadas (como tail)
related_entities = relations['relation_entity'].value_counts()
print("Entidades mais relacionadas:")
print(related_entities.head(20))
```

## Análises Específicas

### 1. Análise de Biomarcadores

```python
# Filtrar biomarcadores e exames com valor numérico
biomarkers = entities[entities['label'].isin(['BIOMARKER', 'LAB_TEST', 'CLINICAL_ATT'])].copy()
biomarkers['numeric_value'] = pd.to_numeric(biomarkers['numeric_value'], errors='coerce')
biomarkers = biomarkers[biomarkers['numeric_value'].notna()]

# Identificar cada medida pelo nome e pela unidade, para não misturar unidades diferentes
biomarkers['marker'] = biomarkers['normalized_entity'] + ' (' + biomarkers['unit'].fillna('sem unidade') + ')'

# Estatísticas por medida
biomarker_stats = biomarkers.groupby('marker')['numeric_value'].describe()
print("Estatísticas por medida:")
print(biomarker_stats)

# Análise por status de detecção
detection_analysis = entities[
    entities['label'].isin(['BIOMARKER', 'LAB_TEST'])
].groupby(['normalized_entity', 'detection_status']).size().unstack(fill_value=0)

print("Análise por status de detecção:")
print(detection_analysis)
```

### 2. Análise de Comorbidades

```python
from collections import Counter
from itertools import combinations

# Doenças confirmadas no paciente.
# Atenção: DISEASE não tem normalized_entity. O texto é usado como veio do documento
# (em minúsculas), então sinônimos como "diabetes" e "DM2" contam como doenças diferentes.
# O term_code (CID-10) pode ajudar a agrupar sinônimos, mas não vem preenchido em muitas
# entidades: use-o como apoio, sem descartar as doenças que não têm código.
diseases = entities[(entities['label'] == 'DISEASE') & (entities['assertion'] == 'PRESENTE')]
patient_diseases = diseases.groupby('patient_id')['entity'].apply(lambda x: sorted(set(x.str.lower())))

multi = patient_diseases[patient_diseases.apply(len) > 1]
print(f"Pacientes com mais de uma doença: {len(multi)}")

# Pares de doenças mais frequentes no mesmo paciente
pair_counts = Counter(pair for d in multi for pair in combinations(d, 2))
print("Pares de doenças mais comuns:")
for (a, b), n in pair_counts.most_common(10):
    print(f"  {a} + {b}: {n} pacientes")
```

### 3. Análise de Padrões de Tratamento

```python
# Relacionar medicamentos a condições (sem menções negadas)
treatment_patterns = df[
    (df['label'] == 'PHARM_SUBSTANCE') &
    (df['relation_type'] == 'may_treat') &
    (~df['assertion'].isin(['AUSENTE']))
].groupby(['entity', 'relation_entity']).size().sort_values(ascending=False)

print("Padrões de tratamento mais comuns:")
print(treatment_patterns.head(20))
```

### 4. Análise de Qualidade dos Dados

```python
# Verificar consistência entre entity e normalized_entity
inconsistent_entities = entities[
    entities['normalized_entity'].notna() &
    (entities['entity'] != entities['normalized_entity'])
][['entity', 'normalized_entity', 'label']].drop_duplicates()

print("Entidades com normalização:")
print(inconsistent_entities.head(10))

# Verificar códigos de terminologia
terminology_coverage = entities[
    entities['terminology'].notna()
].groupby('label')['terminology'].value_counts()

print("Cobertura de terminologia por categoria:")
print(terminology_coverage)
```

## Considerações Específicas

### 1. Anonimização

- **IDs de pacientes e casos**: Anonimizados para preservar privacidade
- **Preservação de privacidade**: Mantenha confidencialidade em todas as análises

### 2. Qualidade dos Dados

```python
# Entidades sem assertion (apenas nas categorias em que ela é inferida)
labels_com_assertion = ['DISEASE', 'PROCEDURE', 'PHARM_SUBSTANCE', 'SYMPTOM',
                        'FINDING', 'INJURY', 'VENT_SUPPORT', 'MEDICAL_DEVICE']
entities_without_assertion = entities[
    entities['label'].isin(labels_com_assertion) &
    entities['assertion'].isna()
].shape[0]
print(f"Entidades sem assertion: {entities_without_assertion}")
```

### 3. Contexto Clínico

```python
# Análise por documento
doc_analysis = df.groupby('document_id').agg({
    'entity_id': 'nunique',
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

### Análise de Séries Temporais

```python
# Análise temporal de biomarcadores
temporal_biomarkers = biomarkers.copy()
temporal_biomarkers['date'] = pd.to_datetime(temporal_biomarkers['document_date'])

# Agrupar por mês e medida
monthly_biomarkers = temporal_biomarkers.groupby([
    temporal_biomarkers['date'].dt.to_period('M'),
    'marker'
])['numeric_value'].mean().unstack()
monthly_biomarkers.index = monthly_biomarkers.index.to_timestamp()

# As 5 medidas com mais registros
top_markers = biomarkers['marker'].value_counts().head(5).index

# Visualizar tendências
plt.figure(figsize=(15, 8))
for biomarker in top_markers:
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

- **Seeds fixos** em análises com etapas aleatórias
- **Versões** do Python e dos pacotes registradas
- **Data e lote dos dados** usados em cada análise

### 3. Validação

- **Sempre valide** resultados com especialistas clínicos
- **Considere limitações** dos dados de PLN
- **Documente incertezas** e limitações
- **Use múltiplas fontes** quando possível
