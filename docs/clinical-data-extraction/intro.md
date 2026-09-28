# Extração de Dados Clínicos

A **Extração de Dados Clínicos** da iHealth disponibiliza dados estruturados a partir do nosso banco de dados clínico, que tem ampla cobertura nacional, provedores em todas as regiões do Brasil e boa representatividade para estudos e projetos. Cada extração é personalizada conforme os critérios definidos pelo cliente contratante.

Esta documentação explica como os dados são organizados, entregues e analisados.

:::info Documentação v1
Para extrações entregues até **20/09/2026**, consulte a [documentação v1](./v1/intro.md).
:::

## O que é a Extração de Dados Clínicos?

A extração é uma seleção estruturada do nosso banco de dados clínico que:

- **Seleciona pacientes** com base em critérios específicos (diagnósticos, medicamentos, procedimentos etc.)
- **Estrutura dados clínicos** em formatos padronizados para análise
- **Preserva o contexto clínico**, mantendo as relações entre entidades e documentos
- **Oferece flexibilidade**, com mais de um formato de disponibilização
- **Mantém a anonimização**, garantindo a privacidade dos pacientes

## Formatos de Disponibilização

Os dados são disponibilizados em dois formatos, organizados em **lotes de arquivos** para facilitar o processamento:

### CSV

- **Granularidade**: cada linha corresponde a 1 entidade clínica
- **Estrutura**: dados "achatados" em colunas
- **Uso recomendado**: análises estatísticas, agregações por tipo de entidade e análises exploratórias
- **Entrega**: arquivos em lotes de 10–50 pacientes cada

### JSONL

- **Granularidade**: cada linha corresponde a 1 documento completo
- **Estrutura**: dados aninhados, preservando a hierarquia
- **Uso recomendado**: análises por documento, preservação do contexto clínico e análises da jornada do paciente
- **Entrega**: arquivos em lotes de 10–50 pacientes cada

> **Importante**: o número de linhas por arquivo varia conforme a quantidade de documentos clínicos disponíveis para cada paciente na base. Para detalhes sobre a estrutura de entrega, consulte [Entrega dos Dados](./delivery.md).

## Público-Alvo

Esta documentação é destinada a:

- **Cientistas de dados** que vão trabalhar com os dados extraídos em análises diversas
- **Analistas de dados** que precisam entender a estrutura e as possibilidades dos dados
- **Pesquisadores** que vão usar os dados em estudos clínicos e de RWE (Real World Evidence)
- **Equipes de Business Intelligence** que vão integrar os dados a dashboards e relatórios

## Próximos Passos

1. **[Estrutura dos Dados](./data-structure.md)**: entenda como os dados extraídos são organizados
2. **[Formato CSV](./csv-format.md)**: aprenda a trabalhar com os dados em CSV
3. **[Formato JSONL](./jsonl-format.md)**: explore a estrutura JSONL
4. **[Entrega dos Dados](./delivery.md)**: saiba como os dados são entregues em lotes e como processá-los
5. **[Diretrizes de Análise](./analysis-guidelines.md)**: boas práticas para análise dos dados extraídos
6. **[Limitações](./limitations.md)**: conheça as limitações e considerações importantes
