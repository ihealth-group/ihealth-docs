# Diretrizes para Análise de Dados

Esta página reúne boas práticas e exemplos de análise dos dados extraídos, da preparação às análises avançadas. É indicada para cientistas e analistas de dados que vão explorar a extração.

## Contexto dos Dados

Os **dados extraídos** representam uma seleção de documentos médicos do nosso banco clínico, com ampla cobertura nacional e representatividade para análises, filtrados conforme os critérios definidos para o projeto.

### Características Importantes dos Dados Extraídos

- **Origem**: banco de dados clínico com ampla cobertura e representatividade para estudos e projetos
- **Seleção**: pacientes e documentos filtrados por critérios específicos (diagnósticos, medicamentos, procedimentos, etc.)
- **Estruturação**: dados processados com Processamento de Linguagem Natural (PLN) para extração de entidades clínicas
- **Anonimização**: identificadores de pacientes e provedores anonimizados
- **Formatos**: disponibilizados em CSV e JSONL para diferentes tipos de análise

## Preparação dos Dados

> Os exemplos desta página são sequenciais: cada bloco usa os imports e as variáveis (`df`, `entities`) criados nos blocos anteriores.

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
- **Valores numéricos ausentes**: campo `numeric_value` vazio
- **Campos estruturados**: preenchidos apenas em `BIOMARKER` e `LAB_TEST`, quando a normalização foi possível
- **Assertion**: vazio nas categorias em que o contexto não é inferido
- **Relações**: nem todas as entidades possuem relações

```python
# Verificar campos vazios por coluna
print("Campos vazios por coluna:")
print(df.isna().sum())
```

## Análises Recomendadas

### 1. Análise Descritiva

#### Caracterização da Coorte {#caracterizacao-da-coorte}

Os campos do paciente se repetem em todas as linhas. Para descrever a coorte, monte primeiro uma tabela com uma linha por paciente:

```python
# Uma linha por paciente
patients = df.groupby('patient_id').agg(
    gender=('gender', 'first'),
    birthdate=('birthdate', 'first'),
    death=('death', 'first'),
    first_doc=('document_date', 'min'),
    last_doc=('document_date', 'max'),
    n_docs=('document_id', 'nunique'),
)

# Idade na data do primeiro documento
patients['age'] = (patients['first_doc'] - patients['birthdate']).dt.days / 365.25

print(f"Pacientes: {len(patients)}")
print("Idade:")
print(patients['age'].describe())
print("Sexo (%):")
print((patients['gender'].value_counts(normalize=True) * 100).round(1))
print("Óbito registrado (%):")
print((patients['death'].value_counts(normalize=True) * 100).round(1))
```

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
# Desconsiderar menções negadas, de familiares ou fora da jornada do paciente
patient_entities = entities[~entities['assertion'].isin(['ABSENT', 'FAMILY_HISTORY', 'OTHER'])].copy()
patient_entities['entity_lower'] = patient_entities['entity'].str.lower()

# Entidades mencionadas para mais pacientes, por categoria
# (contar pacientes evita que quem tem mais documentos pese mais)
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

#### Contexto das Entidades

```python
# Quantidade de menções por categoria e contexto (assertion).
# O fillna mantém na tabela as categorias sem assertion.
print(pd.crosstab(entities['label'], entities['assertion'].fillna('(vazio)')))
```

### 2. Análise Temporal

A quantidade de documentos por período reflete a cobertura da base, não uma tendência clínica. Para estudos com os pacientes, costuma ser mais útil olhar o seguimento de cada um (usa a tabela `patients` da [Caracterização da Coorte](#caracterizacao-da-coorte)):

```python
# Tempo de seguimento: do primeiro ao último documento do paciente
patients['followup_months'] = (patients['last_doc'] - patients['first_doc']).dt.days / 30.44

print("Documentos por paciente:")
print(patients['n_docs'].describe())
print("Seguimento (meses):")
print(patients['followup_months'].describe())

plt.figure(figsize=(10, 5))
patients['followup_months'].plot(kind='hist', bins=30)
plt.title('Tempo de Seguimento por Paciente')
plt.xlabel('Meses entre o primeiro e o último documento')
plt.ylabel('Pacientes')
plt.tight_layout()
plt.show()
```

### 3. Análise Geográfica e por Tipo de Provedor

```python
# Pacientes por UF e por tipo de provedor.
# Um paciente atendido em mais de um provedor é contado em cada um deles.
print("Pacientes por UF:")
print(df.groupby('provider_state_code')['patient_id'].nunique().sort_values(ascending=False))

print("Pacientes por tipo de provedor:")
print(df.groupby('provider_type')['patient_id'].nunique().sort_values(ascending=False))
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

# Entidades mais relacionadas (como tail), por tipo de relação
for relation_type, group in relations.groupby('relation_type'):
    print(f"\n{relation_type}:")
    print(group['relation_entity'].str.lower().value_counts().head(5))
```

## Análises Específicas

### 1. Análise de Biomarcadores e Exames

```python
# Filtrar biomarcadores e exames com valor numérico
biomarkers = entities[entities['label'].isin(['BIOMARKER', 'LAB_TEST'])].copy()
biomarkers['numeric_value'] = pd.to_numeric(biomarkers['numeric_value'], errors='coerce')
biomarkers = biomarkers[biomarkers['numeric_value'].notna()]

# Identificar cada medida pelo nome e pela unidade, para não misturar unidades diferentes
biomarkers['marker'] = biomarkers['normalized_entity'] + ' (' + biomarkers['unit'].fillna('sem unidade') + ')'

# Um mesmo resultado pode ser repetido em vários documentos do paciente.
# Para que quem tem mais documentos não pese mais, use um valor por paciente (aqui, o mais recente).
latest = biomarkers.sort_values('document_date').groupby(['patient_id', 'marker']).tail(1)

# Estatísticas por medida (um valor por paciente)
biomarker_stats = latest.groupby('marker')['numeric_value'].describe()
print("Estatísticas por medida:")
print(biomarker_stats)

# Pacientes por status de detecção.
# Um paciente pode aparecer em mais de um status ao longo do tempo.
detection_analysis = entities[
    entities['label'].isin(['BIOMARKER', 'LAB_TEST'])
].groupby(['normalized_entity', 'detection_status'])['patient_id'].nunique().unstack(fill_value=0)

print("Pacientes por status de detecção:")
print(detection_analysis)
```

### 2. Análise de Comorbidades

```python
from collections import Counter
from itertools import combinations

# Doenças do paciente: presentes ou em histórico (doenças crônicas costumam vir como "histórico de ...").
# Atenção: DISEASE não tem normalized_entity. O texto é usado como veio do documento
# (em minúsculas), então sinônimos como "diabetes" e "DM2" contam como doenças diferentes.
diseases = entities[(entities['label'] == 'DISEASE') & entities['assertion'].isin(['PRESENT', 'HISTORY'])]

# A doença usada na seleção da coorte aparece em quase todos os pacientes e domina os pares.
# Liste aqui os termos dela para deixá-la de fora.
inclusion_terms = []  # ex.: ['câncer de mama', 'neoplasia de mama']
diseases = diseases[~diseases['entity'].str.lower().isin(inclusion_terms)]

patient_diseases = diseases.groupby('patient_id')['entity'].apply(lambda x: sorted(set(x.str.lower())))

multi = patient_diseases[patient_diseases.apply(len) > 1]
print(f"Pacientes com mais de uma doença: {len(multi)}")

# Pares de doenças mais frequentes no mesmo paciente
pair_counts = Counter(pair for d in multi for pair in combinations(d, 2))
print("Pares de doenças mais comuns:")
for (a, b), n in pair_counts.most_common(10):
    print(f"  {a} + {b}: {n} pacientes")
```

### 3. Fármacos Associados a Condições

```python
# Pares fármaco–condição ligados pela relação may_treat (sem menções negadas).
# A relação indica a associação feita no texto, não a sequência ou a linha de tratamento.
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

print("Pares fármaco–condição (pacientes):")
print(drug_condition.head(20))
```

### 4. Análise de Qualidade dos Dados

```python
structured = entities[entities['label'].isin(['BIOMARKER', 'LAB_TEST'])]

# Grafias diferentes agrupadas em cada entidade normalizada (vale revisar as mais variadas)
spellings = structured.groupby('normalized_entity')['entity'].nunique().sort_values(ascending=False)
print("Grafias por entidade normalizada:")
print(spellings.head(10))

# Biomarcadores e exames que não puderam ser normalizados
not_normalized = structured[structured['normalized_entity'].isna()]['entity'].str.lower().value_counts()
print("Mais frequentes sem normalização:")
print(not_normalized.head(10))

# Verificar preenchimento dos campos estruturados (score só se aplica a BIOMARKER)
structured_fields = ['normalized_entity', 'specific_marker', 'method',
                     'detection_status', 'score', 'numeric_value', 'unit']
coverage = structured.groupby('label')[structured_fields].agg(
    lambda col: col.notna().mean()
)

print("Preenchimento dos campos estruturados por categoria (%):")
print((coverage * 100).round(1))
```

## Considerações Específicas

### 1. Anonimização

- **IDs de pacientes e casos**: anonimizados para preservar privacidade
- **Preservação de privacidade**: mantenha confidencialidade em todas as análises

### 2. Qualidade dos Dados

```python
# Entidades sem assertion (apenas nas categorias em que ela é inferida)
labels_com_assertion = ['FINDING', 'INJURY', 'DISEASE', 'PHARM_SUBSTANCE',
                        'PROCEDURE', 'MEDICAL_DEVICE']
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

### Trajetória de Exames por Paciente

A média de um exame por mês mistura pacientes diferentes a cada período. Para acompanhar a evolução, olhe os valores de cada paciente ao longo do tempo.

> **Atenção**: `document_date` é a data do documento, não necessariamente a do exame. Um resultado pode ser transcrito em documentos posteriores; por isso, o exemplo remove valores repetidos do mesmo paciente.

```python
# Medida com mais pacientes
marker = biomarkers.groupby('marker')['patient_id'].nunique().idxmax()

values = (
    biomarkers[biomarkers['marker'] == marker]
    .drop_duplicates(['patient_id', 'numeric_value'])
    .sort_values('document_date')
)
# Dias desde a primeira medida do paciente
values['days'] = (values['document_date'] - values.groupby('patient_id')['document_date'].transform('min')).dt.days

# Pacientes com pelo menos 2 medidas
values = values[values.groupby('patient_id')['patient_id'].transform('size') >= 2]

plt.figure(figsize=(12, 6))
for patient_id, group in values.groupby('patient_id'):
    plt.plot(group['days'], group['numeric_value'], marker='o', alpha=0.4)

plt.title(f'Trajetória por Paciente: {marker}')
plt.xlabel('Dias desde a primeira medida')
plt.ylabel('Valor')
plt.tight_layout()
plt.show()
```

## Boas Práticas

Recomendações de validação clínica, documentação e reprodutibilidade das análises estão em [Limitações e Considerações](./limitations.md#recomendacoes).
