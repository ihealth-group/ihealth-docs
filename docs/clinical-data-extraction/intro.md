# Extração de Dados Clínicos

## Visão Geral

A **Extração de Dados Clínicos** da iHealth é um produto que disponibiliza dados estruturados extraídos de nosso banco de dados clínico, composto por mais de 45 milhões de documentos de aproximadamente 2,7 milhões de pacientes de 31 hospitais brasileiros. Esta extração é personalizada conforme critérios específicos definidos pelo cliente contratante.

## O que é a Extração de Dados Clínicos?

Nossa extração de dados é uma seleção estruturada de nosso banco de dados clínico que:

- **Seleciona pacientes** baseado em critérios específicos (diagnósticos, medicamentos, procedimentos, etc.)
- **Estrutura dados clínicos** em formatos padronizados para análise
- **Preserva contexto clínico** mantendo relações entre entidades e documentos
- **Oferece flexibilidade** com múltiplos formatos de disponibilização
- **Mantém anonimização** garantindo privacidade dos pacientes

## Formatos de Disponibilização

Os dados extraídos são disponibilizados em dois formatos principais, organizados em **lotes de arquivos** para facilitar o processamento:

### 📊 CSV

- **Granularidade**: Cada linha = 1 entidade clínica
- **Estrutura**: Dados "achatados" em colunas
- **Uso recomendado**: Análises estatísticas, agregações por tipo de entidade, análises exploratórias
- **Entrega**: Arquivos em lotes de 10-50 pacientes cada

### 📋 JSONL

- **Granularidade**: Cada linha = 1 documento completo
- **Estrutura**: Dados aninhados preservando hierarquia
- **Uso recomendado**: Análises por documento, preservação de contexto clínico, análises de jornada do paciente
- **Entrega**: Arquivos em lotes de 10-50 pacientes cada

> **Importante**: O número de linhas por arquivo varia conforme a quantidade de documentos clínicos disponíveis para cada paciente na base de dados. Para detalhes completos sobre a estrutura de entrega, consulte a seção [Entrega dos Dados](./delivery.md).

## Público-Alvo

Esta documentação é destinada a:

- **Cientistas de Dados** que trabalharão com os dados extraídos para análises diversas
- **Analistas de Dados** que precisam entender a estrutura e possibilidades dos dados
- **Pesquisadores** que utilizarão os dados para estudos clínicos e RWE (Real World Evidence)
- **Equipes de Business Intelligence** que integrarão os dados em dashboards e relatórios

## Próximos Passos

1. **[Estrutura dos Dados](./data-structure.md)** - Entenda como os dados extraídos são organizados
2. **[Formato CSV](./csv-format.md)** - Aprenda a trabalhar com dados em CSV
3. **[Formato JSONL](./jsonl-format.md)** - Explore a estrutura JSONL
4. **[Entrega dos Dados](./delivery.md)** - Saiba como os dados são entregues em lotes e como processá-los
5. **[Diretrizes de Análise](./analysis-guidelines.md)** - Boas práticas para análise dos dados extraídos
6. **[Limitações](./limitations.md)** - Conheça as limitações e considerações importantes

---

_Esta documentação foi criada para facilitar o uso dos dados extraídos do banco clínico da iHealth por analistas de dados e cientistas._
