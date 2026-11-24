---
displayed_sidebar: docsSidebar
pagination_prev: clinical-data-extraction/v1/analysis-guidelines
pagination_next: null
---

# Limitations and Considerations

:::caution v1 documentation
This documentation covers extractions delivered **up to September 20, 2026**. See the [current version](/clinical-data-extraction/limitations).
:::

## Context of the Extracted Data {#contexto-dos-dados-extraídos}

This section describes the limitations and important considerations for analyzing the **data extracted** from our clinical database. Understanding these limitations is essential to interpret analysis results correctly.

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

| Category    | Main Limitations                              |
| ----------- | --------------------------------------------- |
| `DISEASE`   | May not capture every condition mentioned     |
| `SYMPTOM`   | Subjective symptoms may be missed             |
| `BIOMARKER` | Numeric values may not be extracted correctly |
| `PROCEDURE` | Complex procedures may be fragmented          |

#### Examples of Limitations {#exemplos-de-limitações}

**Extraction Coverage:**

- Different entity categories may have different extraction rates
- Some categories may be more accurate than others
- Check the distribution of entities by category before specific analyses

### 4. Clinical Context {#4-contexto-clínico}

- **Lost nuances**: some clinical nuances may be lost in the extraction
- **Temporal context**: temporal relations between events may not be preserved
- **Severity**: levels of severity may not be captured
- **Progression**: changes over time may not be tracked

## Ethical Considerations {#considerações-éticas}

### 1. Privacy and Confidentiality {#1-privacidade-e-confidencialidade}

- **Anonymized data**: IDs are anonymized, but keep the data confidential
- **Responsible use**: use the data only for approved research purposes
- **Sharing**: do not share the data without proper authorization
- **Storage**: keep the data in secure environments

### 2. Responsible Use {#2-uso-responsável}

**Anonymization Check:**

- Always check that the data is properly anonymized before analyzing it
- Confirm that patient IDs follow the expected anonymization pattern
- Keep data access and usage logs for auditing

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
- **Terminology**: different medical coding systems

#### Ambiguity Example {#exemplo-de-ambiguidade}

**Ambiguous Terms:**

- Terms such as "pressão" (_pressure_) may refer to blood pressure, intracranial pressure or other contexts
- The same entity may be classified in different categories depending on the context
- Review data samples manually to identify possible ambiguities

### 2. Data Structure {#2-estrutura-dos-dados}

#### Format Limitations {#limitações-de-formato}

- **CSV**: loses the original hierarchical structure of the data
- **JSONL**: more complex for simple analyses and basic statistics
- **Empty fields**: not every field is filled in for every entity
- **Completeness**: the availability of information varies by entity type

#### Field Characteristics {#características-dos-campos}

**Data Characteristics:**

- Not every field is filled in for every entity
- Some fields may be empty when the information is not available
- The data structure is consistent, but completeness varies by entity

**Recommendations:**

- Always check data completeness before analyzing it
- Treat empty fields as "information not available"
- Document which fields are essential for your specific analysis

### 3. Performance and Scalability {#3-performance-e-escalabilidade}

- **File size**: large files may be hard to process
- **Memory**: complex analyses may require a lot of memory
- **Processing time**: some analyses may be computationally intensive

## Recommendations {#recomendações}

### 1. Clinical Validation {#1-validação-clínica}

**Validating Results:**

- Always validate results against established clinical knowledge
- Check known disease-symptom associations to detect possible extraction errors
- Consult clinical experts to validate unexpected findings
- Set confidence thresholds based on clinical evidence

**Validation Examples:**

- Check whether patients with diabetes show the expected symptoms (polyuria, polydipsia)
- Check whether patients with hypertension have associated clinical findings (headache, dizziness)
- Confirm whether infarctions are associated with typical symptoms (chest pain, sweating)

### 2. Exploratory Analysis {#2-análise-exploratória}

- **Start simple**: begin with basic descriptive analyses
- **Explore gradually**: increase complexity step by step
- **Document findings**: keep a record of insights
- **Validate hypotheses**: test hypotheses with additional data

### 3. Documentation {#3-documentação}

**Analysis Metadata:**

- Always document the analysis ID, date and responsible analyst
- Describe the objective and methodology clearly
- Record the version of the data used
- Confirm that the limitations were acknowledged
- Document the clinical validation status
- List the tools and packages used
- Include a summary of the main findings
- Define the recommended next steps

**Essential Elements:**

- Unique analysis identifier
- Context and objectives
- Methodology applied
- Acknowledged limitations
- Results and interpretations
- Future recommendations

### 4. Reproducibility {#4-reprodutibilidade}

- **Versioning**: use version control for code and data
- **Environment**: document the execution environment
- **Seeds**: use fixed seeds for random analyses
- **Dependencies**: keep a record of package versions

## Contact and Support {#contato-e-suporte}

For questions about limitations or considerations:

- **Contact**: [oportunidades@ihealthgroup.com.br](mailto:oportunidades@ihealthgroup.com.br)
- **Clinical support**: consult experts for validation

---

_Last updated: September 2026_  
_Version: 1.0_
