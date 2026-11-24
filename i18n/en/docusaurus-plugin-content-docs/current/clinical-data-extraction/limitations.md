# Limitations and Considerations

This page describes the limitations of the extracted data and the care needed to interpret analysis results correctly. We recommend reading it before any analysis.

## Context of the Extracted Data {#contexto-dos-dados-extraídos}

> **Important**: the data provided is a specific selection from our clinical database, processed with Natural Language Processing (NLP) techniques. The limitations described below apply both to the extraction process and to the data selection.

## Data Limitations {#limitações-dos-dados}

### 1. Automatic Structuring {#1-estruturação-automática}

The data is structured automatically using NLP techniques, which can result in:

- **Extraction errors**: some entities may not be identified correctly
- **False positives**: terms may be misclassified
- **False negatives**: important entities may be missed
- **Inconsistencies**: the same term may be extracted differently in similar contexts

### 2. Data Coverage {#2-cobertura-dos-dados}

- **Unprocessed documents**: not every document may have extracted entities
- **Temporal coverage**: the data covers only the period available in the database
- **Geographic coverage**: limited to the providers participating in the system
- **Specialty coverage**: may vary across medical areas

### 3. Extraction Quality {#3-qualidade-da-extração}

#### Limitations by Category {#limitações-por-categoria}

| Category    | Main Limitations                                   |
| ----------- | -------------------------------------------------- |
| `DISEASE`   | May not capture every condition mentioned          |
| `FINDING`   | Subjective symptoms may be missed                  |
| `BIOMARKER` | Numeric values may not be extracted correctly      |
| `PROCEDURE` | Complex procedures may be fragmented               |

#### Context and Structured Fields {#contexto-e-campos-estruturados}

- **Context (`assertion`)**: inferred automatically and may be wrong, for example, a suspicion classified as present
- **`OTHER`**: mentions outside the patient's clinical journey (references, studies, support documents) get `OTHER` and should generally be left out of patient analyses
- **Structured fields**: only filled in when normalization was possible. A biomarker or lab test without `normalized_entity` or `numeric_value` does not mean the result is missing from the document

#### Examples of Limitations {#exemplos-de-limitações}

**Extraction Coverage:**

- Different entity categories may have different extraction rates
- Some categories may be more accurate than others
- Check the distribution of entities by category before specific analyses

### 4. Clinical Context {#4-contexto-clínico}

- **Lost nuances**: some clinical nuances may be lost in the extraction
- **Temporal context**: temporal relations between events may not be captured in every case
- **Document date**: `document_date` is the date of the document, not necessarily the date of the event or test it mentions. A result may be transcribed into later documents and appear more than once for the same patient
- **Severity**: levels of severity may not be captured
- **Progression**: changes over time may not be tracked

## Ethical Considerations {#considerações-éticas}

### 1. Privacy and Confidentiality {#1-privacidade-e-confidencialidade}

- **Anonymized data**: IDs are anonymized, but keep the data confidential
- **Responsible use**: use the data only for approved research purposes
- **Sharing**: do not share the data without proper authorization
- **Storage**: keep the data in secure environments

### 2. Responsible Use {#2-uso-responsável}

- Do not attempt to re-identify patients, professionals or providers
- Do not link the data with databases that contain identified information
- Keep a record of data access and use for auditing

### 3. Transparency {#3-transparência}

- **Document limitations**: always document the limitations of the data
- **Methodology**: describe the methodology used clearly
- **Results**: present results with the right context
- **Review**: submit analyses for peer review when appropriate

## Technical Limitations {#limitações-técnicas}

### 1. Natural Language Processing {#1-processamento-de-linguagem-natural}

#### NLP Challenges {#desafios-do-pln}

- **Ambiguity**: medical terms may have multiple meanings
- **Context**: meaning may depend on the clinical context
- **Natural language**: variation in how concepts are expressed
- **Naming variation**: the same concept may appear with different names, acronyms and abbreviations

#### Ambiguity Example {#exemplo-de-ambiguidade}

**Ambiguous Terms:**

- Terms such as "pressão" (_pressure_) may refer to blood pressure, intracranial pressure or other contexts
- The same entity may be classified in different categories depending on the context
- Review data samples manually to identify possible ambiguities

### 2. Data Structure {#2-estrutura-dos-dados}

- **CSV**: loses the original hierarchical structure of the data
- **JSONL**: is more complex for simple analyses and basic statistics
- **Empty fields**: not every field is filled in for every entity, and completeness varies by entity type. Treat an empty field as "information not available" and check the completeness of the fields essential to your analysis before you start

### 3. Performance and Scalability {#3-performance-e-escalabilidade}

- **File size**: large files may be hard to process
- **Memory**: complex analyses may require a lot of memory
- **Processing time**: some analyses may be computationally intensive

## Recommendations {#recomendacoes}

### 1. Clinical Validation {#1-validação-clínica}

- Validate results against established clinical knowledge
- Consult clinical experts to validate unexpected findings
- Manually review a sample of the extracted entities before drawing important conclusions

**Validation Examples:**

- Compare the prevalence of diseases in the cohort with the prevalence reported in the literature for similar populations
- Check whether the drugs linked to a disease by `may_treat` match known treatments
- Check whether lab test values fall within plausible ranges for the reported unit

### 2. Exploratory Analysis {#2-análise-exploratória}

- **Start simple**: begin with basic descriptive analyses
- **Explore gradually**: increase complexity step by step
- **Document findings**: keep a record of insights
- **Validate hypotheses**: test hypotheses with additional data

### 3. Documentation {#3-documentação}

Record for each analysis:

- identification, date and responsible analyst
- objective and methodology
- version of the data used (delivery date and batches)
- known limitations and clinical validation status
- tools and packages used, with versions
- main results, interpretations and next steps

### 4. Reproducibility {#4-reprodutibilidade}

- **Versioning**: use version control for code and data
- **Environment**: document the execution environment
- **Seeds**: use fixed seeds for random analyses
- **Dependencies**: keep a record of package versions

## Contact and Support {#contato-e-suporte}

For questions about limitations or considerations:

- **Contact**: [oportunidades@ihealthgroup.com.br](mailto:oportunidades@ihealthgroup.com.br)
- **Clinical support**: consult experts for validation
