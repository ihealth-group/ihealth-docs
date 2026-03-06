# Formato JSONL

## Características

- **Granularidade**: Cada linha = 1 documento completo
- **Estrutura**: Dados aninhados preservando hierarquia original
- **Uso recomendado**: Análises por documento, preservação de contexto clínico

> **Relação com a Estrutura dos Dados**: Este formato JSONL implementa a mesma estrutura de dados descrita em [Estrutura dos Dados](./data-structure.md), mas com organizações aninhadas específicas que preservam melhor o contexto clínico original. Os campos básicos permanecem os mesmos, mas são agrupados e estruturados de forma hierárquica.

## Estrutura do Arquivo JSONL

### Formato Geral

Cada linha do arquivo JSONL contém um objeto JSON completo representando um documento:

```json
{
  "document_id": "doc_123",
  "document_date": "2023-05-31 13:15:47",
  "patient_id": "patient_abc123",
  "case_id": "case_xyz789",
  "gender": "MALE",
  "birthdate": "1980-05-15 00:00:00",
  "death": "N",
  "provider_state_code": "SP",
  "provider_type": "Convênio ou Particular",
  "preds": {
    "clinical_entities": [...],
    "biomarkers": [...],
    "lab_tests": [...],
    "vital_signs": [...],
    "entities_relations": [...]
  }
}
```

## Estrutura Aninhada das Entidades

> **Importante**: O formato JSONL preserva estruturas aninhadas que não estão presentes no formato CSV. Estas estruturas permitem uma representação mais rica e contextualizada dos dados clínicos, mantendo a hierarquia original dos documentos.

### Estruturas Aninhadas Específicas do JSONL

#### 1. Objeto `el` (Entity Linking) - Entidades Clínicas

Para entidades clínicas com terminologia padronizada, o JSONL utiliza um objeto aninhado `el` que contém:

- `terminology`: Sistema de codificação (CID-10, ATC, TUSS)
- `term_code`: Código específico da terminologia
- `term_desc`: Descrição padronizada do termo

#### 2. Objeto `result` - Biomarcadores, Exames e Sinais Vitais

Para entidades com valores estruturados, o JSONL utiliza um objeto aninhado `result` que contém:

- `numeric_value`: Valor numérico (quando disponível)
- `unit`: Unidade de medida
- `detection_status`: Status de detecção (para biomarcadores e exames)
- `condition`: Condições associadas (para sinais vitais)

#### 3. Agrupamento por Categoria

O JSONL organiza as entidades em grupos específicos dentro do objeto `preds`:

- `clinical_entities`: Doenças, sintomas, procedimentos, etc.
- `biomarkers`: Biomarcadores com valores estruturados
- `lab_tests`: Exames laboratoriais
- `vital_signs`: Sinais vitais e medidas clínicas
- `entities_relations`: Relações entre entidades

### 1. Entidades Clínicas (`clinical_entities`)

```json
"clinical_entities": [
  {
    "entity_id": "doc_123_45",
    "entity": "hipertensão",
    "label": "DISEASE",
    "assertion": "PRESENTE",
    "el": {
      "terminology": "CID-10",
      "term_code": "I10",
      "term_desc": "Hipertensão arterial essencial"
    }
  }
]
```

### 2. Biomarcadores (`biomarkers`)

```json
"biomarkers": [
  {
    "entity_id": "doc_123_120",
    "entity": "HER2 positivo",
    "label": "BIOMARKER",
    "normalized_entity": "HER2",
    "specific_marker": "",
    "loinc_code": "33747-0",
    "result": {
      "numeric_value": "",
      "unit": "",
      "detection_status": "POS"
    }
  },
  {
    "entity_id": "doc_123_130",
    "entity": "KI67 25%",
    "label": "BIOMARKER",
    "normalized_entity": "KI67",
    "specific_marker": "",
    "loinc_code": "33747-0",
    "result": {
      "numeric_value": 25,
      "unit": "%",
      "detection_status": ""
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
    "result": {
      "numeric_value": 150000.0,
      "unit": "mm³",
      "detection_status": ""
    }
  },
  {
    "entity_id": "doc_123_210",
    "entity": "vitamina D 25 ng/mL",
    "label": "LAB_TEST",
    "normalized_entity": "Vitamina D",
    "result": {
      "numeric_value": 25.0,
      "unit": "ng/mL",
      "detection_status": ""
    }
  }
]
```

### 4. Sinais Vitais (`vital_signs`)

```json
"vital_signs": [
  {
    "entity_id": "doc_123_300",
    "entity": "altura 1.70 m",
    "label": "CLINICAL_ATT",
    "normalized_entity": "Altura",
    "result": {
      "numeric_value": 1.7,
      "unit": "m",
      "condition": ""
    }
  },
  {
    "entity_id": "doc_123_310",
    "entity": "peso 75 kg",
    "label": "CLINICAL_ATT",
    "normalized_entity": "Peso",
    "result": {
      "numeric_value": 75.0,
      "unit": "kg",
      "condition": ""
    }
  }
]
```

### 5. Relações entre Entidades (`entities_relations`)

```json
"entities_relations": [
  {
    "relation_type": "disease_has_finding",
    "head_entity": "hipertensão",
    "tail_entity": "pressão alta"
  },
  {
    "relation_type": "may_treat",
    "head_entity": "metformina",
    "tail_entity": "diabetes"
  }
]
```

## Trabalhando com JSONL

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

        # Acessar terminologia
        if 'el' in entity:
            print(f"  Terminologia: {entity['el']['terminology']}")
            print(f"  Código: {entity['el']['term_code']}")
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
        print(f"LOINC: {biomarker['loinc_code']}")

        # Acessar resultado
        if 'result' in biomarker:
            result = biomarker['result']
            print(f"Valor: {result['numeric_value']}")
            print(f"Unidade: {result['unit']}")
            print(f"Status: {result['detection_status']}")
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

        if 'result' in lab_test:
            result = lab_test['result']
            print(f"Valor: {result['numeric_value']}")
            print(f"Unidade: {result['unit']}")
            print(f"Status: {result['detection_status']}")
        print("---")
```

### Acessando Sinais Vitais

```python
# Acessar sinais vitais
for doc in data:
    for vital in doc['preds']['vital_signs']:
        print(f"ID: {vital['entity_id']}")
        print(f"Sinal Vital: {vital['entity']}")
        print(f"Normalizado: {vital['normalized_entity']}")

        if 'result' in vital:
            result = vital['result']
            print(f"Valor: {result['numeric_value']}")
            print(f"Unidade: {result['unit']}")
            print(f"Condição: {result['condition']}")
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

### Análise por Documento

```python
# Análise de documentos
for doc in data:
    doc_id = doc['document_id']
    patient_id = doc['patient_id']

    # Contar entidades por tipo
    clinical_count = len(doc['preds']['clinical_entities'])
    biomarker_count = len(doc['preds']['biomarkers'])
    lab_count = len(doc['preds']['lab_tests'])
    vital_count = len(doc['preds']['vital_signs'])
    relation_count = len(doc['preds']['entities_relations'])

    print(f"Documento {doc_id} (Paciente {patient_id}):")
    print(f"  Entidades clínicas: {clinical_count}")
    print(f"  Biomarcadores: {biomarker_count}")
    print(f"  Exames laboratoriais: {lab_count}")
    print(f"  Sinais vitais: {vital_count}")
    print(f"  Relações: {relation_count}")
    print("---")
```

### Extraindo Dados para Análise

```python
# Extrair todos os biomarcadores
all_biomarkers = []
for doc in data:
    for biomarker in doc['preds']['biomarkers']:
        biomarker_data = {
            'document_id': doc['document_id'],
            'patient_id': doc['patient_id'],
            'entity_id': biomarker['entity_id'],
            'entity': biomarker['entity'],
            'normalized_entity': biomarker['normalized_entity'],
            'loinc_code': biomarker['loinc_code']
        }

        if 'result' in biomarker:
            biomarker_data.update(biomarker['result'])

        all_biomarkers.append(biomarker_data)

# Converter para DataFrame
import pandas as pd
biomarkers_df = pd.DataFrame(all_biomarkers)
print(biomarkers_df.head())
```

### Análise de Comorbidades

```python
# Identificar pacientes com múltiplas condições
patient_conditions = {}
for doc in data:
    patient_id = doc['patient_id']
    conditions = []

    for entity in doc['preds']['clinical_entities']:
        if entity['label'] == 'DISEASE':
            conditions.append(entity['entity'])

    if patient_id not in patient_conditions:
        patient_conditions[patient_id] = []
    patient_conditions[patient_id].extend(conditions)

# Pacientes com múltiplas condições
comorbidities = {k: v for k, v in patient_conditions.items() if len(set(v)) > 1}
print(f"Pacientes com comorbidades: {len(comorbidities)}")
```

## Diferenças entre CSV e JSONL

### 1. Estrutura de Resultados

**JSONL** (aninhado):

```json
"result": {
  "numeric_value": 12.5,
  "unit": "g/dL",
  "detection_status": "normal"
}
```

**CSV** (achatado):

```csv
numeric_value,unit,detection_status
12.5,g/dL,normal
```

### 2. Formato de Relações

Uma diferença importante entre os formatos está na representação das relações entre entidades:

#### JSONL - Relações Estruturadas

```json
"entities_relations": [
  {
    "relation_type": "disease_has_finding",
    "head_entity": "hipertensão",
    "tail_entity": "pressão alta"
  }
]
```

#### CSV - Relações Achatadas

```csv
relation_type,relation_entity,relation_position
disease_has_finding,pressão alta,tail
disease_has_finding,hipertensão,head
```

**Principais Diferenças:**

| Aspecto           | JSONL                                    | CSV                                                      |
| ----------------- | ---------------------------------------- | -------------------------------------------------------- |
| **Estrutura**     | Objeto com `head_entity` e `tail_entity` | Campos separados `relation_entity` e `relation_position` |
| **Clareza**       | Relação explícita entre duas entidades   | Relação implícita, requer interpretação da posição       |
| **Processamento** | Acesso direto às entidades relacionadas  | Necessário combinar campos para entender a relação       |
| **Linhas**        | Uma linha por relação completa           | Uma linha por "lado" da relação                          |

### 3. Considerações Importantes

#### Impacto nas Análises

**Análise de Relações:**

- **JSONL**: Mais intuitivo para análise de relacionamentos diretos
- **CSV**: Requer agregação e reconstrução das relações

**Performance:**

- **JSONL**: Melhor para análises por documento completo
- **CSV**: Melhor para análises estatísticas de entidades individuais

**Complexidade de Processamento:**

- **JSONL**: Estrutura mais complexa, mas mais rica em contexto
- **CSV**: Estrutura mais simples, mas perde informações de relacionamento

#### Recomendações de Uso

**Use JSONL quando:**

- Analisando comorbidades e relacionamentos entre condições
- Estudando padrões por documento ou paciente
- Preservando contexto clínico completo
- Trabalhando com análises de rede de entidades

**Use CSV quando:**

- Fazendo análises estatísticas de entidades individuais
- Trabalhando com ferramentas que preferem dados tabulares
- Realizando análises de frequência e distribuição
- Processando grandes volumes de dados com foco em performance

### Vantagens do JSONL

1. **Preservação de Contexto**: Mantém a estrutura original dos dados
2. **Flexibilidade**: Permite análises mais complexas
3. **Hierarquia**: Preserva relacionamentos entre entidades
4. **Eficiência**: Uma linha por documento facilita processamento
5. **Relações Explícitas**: Representação clara de relacionamentos entre entidades

### Quando Usar JSONL

- Análises que requerem contexto completo do documento
- Estudos de comorbidades e relacionamentos
- Análises por paciente ou caso clínico
- Preservação de estrutura hierárquica
- Análises de rede de entidades clínicas

---

**Anterior**: [Formato CSV](./csv-format.md)  
**Próximo**: [Diretrizes de Análise](./analysis-guidelines.md)
