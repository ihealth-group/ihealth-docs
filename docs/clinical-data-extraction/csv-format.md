# Formato CSV

Esta página descreve o arquivo CSV da extração e traz exemplos de código em Python (pandas) para carregar, validar e analisar os dados. É indicada para quem vai trabalhar com os dados em formato tabular.

## Características

- **Granularidade**: cada linha corresponde a 1 entidade clínica
- **Estrutura**: dados "achatados" em colunas
- **Uso recomendado**: análises de entidades individuais e estatísticas por tipo de entidade

## Estrutura do Arquivo CSV

### Cabeçalho

```csv
document_id,document_date,patient_id,case_id,gender,birthdate,death,provider_state_code,provider_type,entity_id,entity,label,assertion,normalized_entity,specific_marker,method,detection_status,score,numeric_value,unit,relation_type,relation_entity,relation_position
```

Os campos `normalized_entity` a `unit` são os [campos estruturados](./data-structure.md#campos-estruturados-de-biomarcadores-e-exames) e só vêm preenchidos em `BIOMARKER` e `LAB_TEST`.

### Exemplo de Dados

```csv
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,FEMALE,1980-05-15 00:00:00,N,SP,Público,doc_123_45,câncer de mama,DISEASE,PRESENT,,,,,,,,disease_has_biomarker,HER2 3+,head
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,FEMALE,1980-05-15 00:00:00,N,SP,Público,doc_123_120,HER2 3+,BIOMARKER,,HER2,,imuno-histoquímica,POS,3+,,,disease_has_biomarker,câncer de mama,tail
doc_123,2023-05-31 13:15:47,patient_abc123,case_xyz789,FEMALE,1980-05-15 00:00:00,N,SP,Público,doc_123_200,plaquetas 150.000/mm³,LAB_TEST,,Plaquetas,,,,,150000.0,mm³,,,
doc_456,2023-06-15 09:30:22,patient_def456,case_uvw123,MALE,1975-03-20 00:00:00,N,MG,Convênio ou Particular,doc_456_78,metformina,PHARM_SUBSTANCE,PRESENT,,,,,,,,may_treat,diabetes,head
doc_456,2023-06-15 09:30:22,patient_def456,case_uvw123,MALE,1975-03-20 00:00:00,N,MG,Convênio ou Particular,doc_456_90,rx tórax,PROCEDURE,PRESENT,,,,,,,,procedure_has_target_anatomy,tórax,head
```

No exemplo, o câncer de mama e o biomarcador HER2 estão ligados pela relação `disease_has_biomarker`: cada um aparece em uma linha, com a outra entidade em `relation_entity` e a própria posição na relação em `relation_position`.

## Trabalhando com CSV

> Os exemplos desta página são sequenciais: cada bloco usa os imports e as variáveis (`df`, `entities`) criados nos blocos anteriores.

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

# Uma entidade com mais de uma relação aparece em mais de uma linha (mesmo entity_id).
# Para contar entidades, use uma linha por entity_id.
entities = df.drop_duplicates('entity_id')

# Verificar valores únicos
print("Labels disponíveis:", entities['label'].unique())
```

### Análise de Biomarcadores e Exames

```python
# Filtrar biomarcadores e exames com valor numérico
numeric_entities = entities[entities['label'].isin(['BIOMARKER', 'LAB_TEST'])].copy()
numeric_entities['numeric_value'] = pd.to_numeric(numeric_entities['numeric_value'], errors='coerce')
numeric_entities = numeric_entities[numeric_entities['numeric_value'].notna()]

# Estatísticas por exame e unidade (a mesma medida pode vir em unidades diferentes).
# Os valores são por menção: o mesmo resultado pode se repetir em vários documentos do paciente.
biomarker_stats = numeric_entities.groupby(['normalized_entity', 'unit'], dropna=False)['numeric_value'].describe()
print(biomarker_stats)
```

### Análise de Relações

```python
# Cada relação aparece em duas linhas (uma da entidade head e outra da tail).
# Para contar relações, use só as linhas da head.
relations = df[df['relation_position'] == 'head']

# Relações mais comuns
relation_types = relations['relation_type'].value_counts()
print(relation_types)

# Entidades mais relacionadas (como tail), por tipo de relação
related_entities = relations.groupby('relation_type')['relation_entity'].value_counts()
print(related_entities)

# Uma linha por relação, no mesmo formato do JSONL (head → tail)
relations_table = relations[['document_id', 'relation_type', 'entity', 'relation_entity']].rename(
    columns={'entity': 'head_entity', 'relation_entity': 'tail_entity'}
)
print(relations_table.head())
```

## Considerações Importantes

### 1. Múltiplas Linhas por Documento

- Um documento pode gerar várias linhas (uma para cada entidade)
- Use `document_id` para agrupar entidades do mesmo documento

### 2. Campos Vazios

- Nem todas as entidades possuem todos os campos preenchidos
- No arquivo, campos vazios ficam em branco. Ao carregar com pandas, eles viram `NaN`: use `.isna()` e `.notna()` para verificá-los
- Valide a presença de dados antes de análises

### 3. Relações

- Uma entidade com mais de uma relação aparece em uma linha por relação, com o mesmo `entity_id`
- Cada relação aparece em duas linhas: a da entidade `head` e a da entidade `tail` (`relation_position`)
- Para contar entidades, remova as duplicatas por `entity_id`; para contar relações, use só as linhas com `relation_position == 'head'`

## Próximos Passos

Para exemplos de análise (distribuição de entidades, análises temporal e geográfica, comorbidades e outras), veja [Diretrizes de Análise](./analysis-guidelines.md).
