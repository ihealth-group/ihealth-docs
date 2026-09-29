# Formato JSONL

Esta página descreve o arquivo JSONL da extração, em que cada linha é um documento com suas entidades agrupadas, e traz exemplos de código em Python para ler e analisar os dados. É indicada para quem precisa preservar o contexto do documento ou trabalhar com as relações entre entidades.

## Características

- **Granularidade**: cada linha corresponde a 1 documento completo
- **Estrutura**: dados aninhados, preservando a hierarquia original
- **Uso recomendado**: análises por documento e preservação do contexto clínico

> **Relação com a Estrutura dos Dados**: o JSONL traz os mesmos campos descritos em [Estrutura dos Dados](./data-structure.md), mas agrupados de forma hierárquica, o que preserva melhor o contexto clínico original.

## Estrutura do Arquivo JSONL

### Formato Geral

Cada linha do arquivo JSONL contém um objeto JSON completo representando um documento:

```json
{
  "document_id": "doc_123",
  "document_date": "2023-05-31 13:15:47",
  "patient_id": "patient_abc123",
  "case_id": "case_xyz789",
  "gender": "FEMALE",
  "birthdate": "1980-05-15 00:00:00",
  "death": "N",
  "provider_state_code": "SP",
  "provider_type": "Público",
  "preds": {
    "clinical_entities": [...],
    "biomarkers": [...],
    "lab_tests": [...],
    "entities_relations": [...]
  }
}
```

## Estrutura Aninhada das Entidades

> **Importante**: o formato JSONL preserva estruturas aninhadas que não existem no CSV. Elas permitem uma representação mais rica e contextualizada dos dados clínicos, mantendo a hierarquia original dos documentos.

### Estruturas Aninhadas Específicas do JSONL

#### 1. Objeto `result`: Biomarcadores e Exames

Os [campos estruturados](./data-structure.md#campos-estruturados-de-biomarcadores-e-exames) de biomarcadores e exames ficam divididos em dois níveis:

- **No nível da entidade**: `normalized_entity`, `specific_marker` e `method`
- **Dentro de `result`**: `detection_status`, `numeric_value`, `unit` e, apenas em biomarcadores, `score`

#### 2. Agrupamento por Categoria

O JSONL organiza as entidades em grupos dentro do objeto `preds`:

- `clinical_entities`: entidades das demais categorias (doenças, achados clínicos, fármacos, procedimentos etc.)
- `biomarkers`: biomarcadores (`BIOMARKER`)
- `lab_tests`: exames laboratoriais (`LAB_TEST`)
- `entities_relations`: relações entre entidades

### 1. Entidades Clínicas (`clinical_entities`)

```json
"clinical_entities": [
  {
    "entity_id": "doc_123_45",
    "entity": "câncer de mama",
    "label": "DISEASE",
    "assertion": "PRESENT"
  },
  {
    "entity_id": "doc_123_60",
    "entity": "mama esquerda",
    "label": "BODY_PART",
    "assertion": ""
  }
]
```

### 2. Biomarcadores (`biomarkers`)

```json
"biomarkers": [
  {
    "entity_id": "doc_123_120",
    "entity": "HER2 3+",
    "label": "BIOMARKER",
    "normalized_entity": "HER2",
    "specific_marker": "",
    "method": "imuno-histoquímica",
    "result": {
      "detection_status": "POS",
      "score": "3+",
      "numeric_value": "",
      "unit": ""
    }
  },
  {
    "entity_id": "doc_123_130",
    "entity": "KI67 25%",
    "label": "BIOMARKER",
    "normalized_entity": "KI67",
    "specific_marker": "",
    "method": "",
    "result": {
      "detection_status": "",
      "score": "",
      "numeric_value": 25,
      "unit": "%"
    }
  }
]
```

### 3. Exames Laboratoriais (`lab_tests`)

```json
"lab_tests": [
  {
    "entity_id": "doc_123_200",
    "entity": "plaquetas 150.000/mm³",
    "label": "LAB_TEST",
    "normalized_entity": "Plaquetas",
    "specific_marker": "",
    "method": "",
    "result": {
      "detection_status": "",
      "numeric_value": 150000.0,
      "unit": "mm³"
    }
  },
  {
    "entity_id": "doc_123_210",
    "entity": "vitamina D 25 ng/mL",
    "label": "LAB_TEST",
    "normalized_entity": "Vitamina D",
    "specific_marker": "",
    "method": "",
    "result": {
      "detection_status": "",
      "numeric_value": 25.0,
      "unit": "ng/mL"
    }
  }
]
```

### 4. Relações entre Entidades (`entities_relations`)

```json
"entities_relations": [
  {
    "relation_type": "disease_has_biomarker",
    "head_entity": "câncer de mama",
    "tail_entity": "HER2 3+"
  },
  {
    "relation_type": "disease_has_anatomic_site",
    "head_entity": "câncer de mama",
    "tail_entity": "mama esquerda"
  }
]
```

## Trabalhando com JSONL

> Os exemplos desta página são sequenciais: cada bloco usa a variável `data` criada em "Carregando Dados".

### Carregando Dados

```python
import json

# Carregar dados JSONL
data = []
with open('dados_extraidos.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data.append(json.loads(line))

print(f"Total de documentos: {len(data)}")
```

### Acessando Entidades Clínicas

```python
# Acessar entidades clínicas
for doc in data:
    print(f"Documento: {doc['document_id']}")
    for entity in doc['preds']['clinical_entities']:
        print(f"  ID: {entity['entity_id']}")
        print(f"  Entidade: {entity['entity']}")
        print(f"  Label: {entity['label']}")
        print(f"  Assertion: {entity['assertion']}")
        print("---")
```

### Acessando Biomarcadores

```python
# Acessar biomarcadores
for doc in data:
    for biomarker in doc['preds']['biomarkers']:
        print(f"ID: {biomarker['entity_id']}")
        print(f"Biomarcador: {biomarker['entity']}")
        print(f"Normalizado: {biomarker['normalized_entity']}")
        print(f"Método: {biomarker['method']}")

        # Acessar resultado
        if 'result' in biomarker:
            result = biomarker['result']
            print(f"Status: {result['detection_status']}")
            print(f"Score: {result['score']}")
            print(f"Valor: {result['numeric_value']}")
            print(f"Unidade: {result['unit']}")
        print("---")
```

### Acessando Exames Laboratoriais

```python
# Acessar exames laboratoriais
for doc in data:
    for lab_test in doc['preds']['lab_tests']:
        print(f"ID: {lab_test['entity_id']}")
        print(f"Exame: {lab_test['entity']}")
        print(f"Normalizado: {lab_test['normalized_entity']}")
        print(f"Método: {lab_test['method']}")

        if 'result' in lab_test:
            result = lab_test['result']
            print(f"Status: {result['detection_status']}")
            print(f"Valor: {result['numeric_value']}")
            print(f"Unidade: {result['unit']}")
        print("---")
```

### Acessando Relações

```python
# Acessar relações
for doc in data:
    for relation in doc['preds']['entities_relations']:
        print(f"Relação: {relation['relation_type']}")
        print(f"De: {relation['head_entity']}")
        print(f"Para: {relation['tail_entity']}")
        print("---")
```

## Análises com JSONL

### Resumo por Documento e Jornada do Paciente

```python
import pandas as pd

# Uma linha por documento, com a quantidade de itens em cada grupo
docs = pd.DataFrame([
    {
        'document_id': doc['document_id'],
        'patient_id': doc['patient_id'],
        'document_date': doc['document_date'],
        **{group: len(items) for group, items in doc['preds'].items()},
    }
    for doc in data
])
docs['document_date'] = pd.to_datetime(docs['document_date'])

print(docs.describe())

# Jornada do paciente: documentos em ordem cronológica
patient_id = docs['patient_id'].iloc[0]
print(docs[docs['patient_id'] == patient_id].sort_values('document_date'))
```

### Convertendo para DataFrames

Para análises tabulares, cada grupo de `preds` pode virar um DataFrame, com os dados do documento em cada linha:

```python
import pandas as pd

def to_dataframe(data, group):
    """Transforma um grupo de preds (ex.: 'biomarkers') em DataFrame."""
    df = pd.json_normalize(
        data,
        record_path=['preds', group],
        meta=['document_id', 'document_date', 'patient_id'],
    )
    # Remove o prefixo "result." dos campos estruturados
    df.columns = [col.replace('result.', '') for col in df.columns]
    return df

clinical_df = to_dataframe(data, 'clinical_entities')
biomarkers_df = to_dataframe(data, 'biomarkers')
lab_tests_df = to_dataframe(data, 'lab_tests')
relations_df = to_dataframe(data, 'entities_relations')

# No JSONL, campos vazios vêm como "": converta os valores numéricos antes de analisar
biomarkers_df['numeric_value'] = pd.to_numeric(biomarkers_df['numeric_value'], errors='coerce')
lab_tests_df['numeric_value'] = pd.to_numeric(lab_tests_df['numeric_value'], errors='coerce')

print(biomarkers_df.head())
```

### Análise de Comorbidades

```python
from collections import Counter, defaultdict
from itertools import combinations

# Doenças do paciente: presentes ou em histórico (doenças crônicas costumam vir como "histórico de ...").
# Atenção: DISEASE não tem normalized_entity. O texto é usado como veio do documento
# (em minúsculas), então sinônimos como "diabetes" e "DM2" contam como doenças diferentes.
# A doença usada na seleção da coorte aparece em quase todos os pacientes e domina os pares.
# Liste aqui os termos dela para deixá-la de fora.
inclusion_terms = set()  # ex.: {'câncer de mama', 'neoplasia de mama'}

patient_diseases = defaultdict(set)
for doc in data:
    for entity in doc['preds']['clinical_entities']:
        name = entity['entity'].lower()
        if (entity['label'] == 'DISEASE'
                and entity.get('assertion') in ('PRESENT', 'HISTORY')
                and name not in inclusion_terms):
            patient_diseases[doc['patient_id']].add(name)

multi = {p: d for p, d in patient_diseases.items() if len(d) > 1}
print(f"Pacientes com mais de uma doença: {len(multi)}")

# Pares de doenças mais frequentes no mesmo paciente
pair_counts = Counter(pair for d in multi.values() for pair in combinations(sorted(d), 2))
for (a, b), n in pair_counts.most_common(10):
    print(f"  {a} + {b}: {n} pacientes")
```

## Diferenças entre CSV e JSONL

### 1. Estrutura de Resultados

**JSONL** (aninhado):

```json
"result": {
  "detection_status": "",
  "numeric_value": 12.5,
  "unit": "g/dL"
}
```

**CSV** (achatado):

```csv
detection_status,numeric_value,unit
,12.5,g/dL
```

### 2. Formato de Relações

Uma diferença importante entre os formatos está na representação das relações entre entidades:

#### JSONL - Relações Estruturadas

```json
"entities_relations": [
  {
    "relation_type": "may_treat",
    "head_entity": "metformina",
    "tail_entity": "diabetes"
  }
]
```

#### CSV - Relações Achatadas

```csv
entity,relation_type,relation_entity,relation_position
metformina,may_treat,diabetes,head
diabetes,may_treat,metformina,tail
```

No exemplo, o medicamento **metformina** pode tratar a doença **diabetes** (`may_treat`). No JSONL, a relação aparece uma vez, com o medicamento como `head_entity` e a doença como `tail_entity`. No CSV, cada entidade tem sua própria linha: `relation_entity` indica a outra entidade da relação e `relation_position` indica a posição da entidade da linha (`head` ou `tail`).

**Principais Diferenças:**

| Aspecto           | JSONL                                    | CSV                                                      |
| ----------------- | ---------------------------------------- | -------------------------------------------------------- |
| **Estrutura**     | Objeto com `head_entity` e `tail_entity` | Campos separados `relation_entity` e `relation_position` |
| **Clareza**       | Relação explícita entre duas entidades   | Relação implícita, requer interpretação da posição       |
| **Processamento** | Acesso direto às entidades relacionadas  | Necessário combinar campos para entender a relação       |
| **Linhas**        | Uma linha por relação completa           | Uma linha por "lado" da relação                          |

### 3. Quando Usar JSONL ou CSV

**Use JSONL quando:**

- a análise depende do contexto completo do documento ou da jornada do paciente
- o foco são as relações entre entidades (por exemplo, doença e biomarcador, fármaco e condição)
- você quer a relação explícita, com `head_entity` e `tail_entity`

**Use CSV quando:**

- o foco são estatísticas de entidades individuais (frequência, distribuição)
- suas ferramentas trabalham melhor com dados tabulares
- você prefere uma estrutura simples, sem aninhamento
