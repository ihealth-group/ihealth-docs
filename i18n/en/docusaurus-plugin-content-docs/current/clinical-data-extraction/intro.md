# Clinical Data Extraction

iHealth's **Clinical Data Extraction** delivers structured data from our clinical database, which has broad national coverage, providers in every region of Brazil and good representativeness for studies and projects. Each extraction is customized according to the criteria defined by the contracting client.

This documentation explains how the data is organized, delivered and analyzed.

:::info v1 documentation
For extractions delivered up to **September 20, 2026**, see the [v1 documentation](./v1/intro.md).
:::

:::note Language of the data
The clinical documents are Brazilian, so the extracted values (such as `entity`, `normalized_entity`, `relation_entity` and `provider_type`) are in Portuguese. The examples in this documentation keep them in Portuguese, exactly as they appear in the files.
:::

## What is Clinical Data Extraction? {#o-que-é-a-extração-de-dados-clínicos}

The extraction is a structured selection from our clinical database that:

- **Selects patients** based on specific criteria (diagnoses, medications, procedures, etc.)
- **Structures clinical data** in standardized formats for analysis
- **Preserves clinical context**, keeping the relations between entities and documents
- **Offers flexibility**, with more than one delivery format
- **Maintains anonymization**, protecting patient privacy

## Delivery Formats {#formatos-de-disponibilização}

The data is delivered in two formats, organized in **file batches** to make processing easier:

### CSV {#csv}

- **Granularity**: each row corresponds to 1 clinical entity
- **Structure**: "flattened" data in columns
- **Recommended use**: statistical analyses, aggregations by entity type and exploratory analyses
- **Delivery**: files in batches of 10–50 patients each

### JSONL {#jsonl}

- **Granularity**: each line corresponds to 1 complete document
- **Structure**: nested data, preserving the hierarchy
- **Recommended use**: document-level analyses, preserving clinical context and patient journey analyses
- **Delivery**: files in batches of 10–50 patients each

> **Important**: the number of rows per file varies with the number of clinical documents available for each patient in the database. For details on the delivery structure, see [Data Delivery](./delivery.md).

## Audience {#público-alvo}

This documentation is intended for:

- **Data scientists** who will work with the extracted data in a range of analyses
- **Data analysts** who need to understand the structure and possibilities of the data
- **Researchers** who will use the data in clinical and RWE (Real World Evidence) studies
- **Business Intelligence teams** who will integrate the data into dashboards and reports

## Next Steps {#próximos-passos}

1. **[Data Structure](./data-structure.md)**: understand how the extracted data is organized
2. **[CSV Format](./csv-format.md)**: learn how to work with the data in CSV
3. **[JSONL Format](./jsonl-format.md)**: explore the JSONL structure
4. **[Data Delivery](./delivery.md)**: learn how the data is delivered in batches and how to process it
5. **[Analysis Guidelines](./analysis-guidelines.md)**: best practices for analyzing the extracted data
6. **[Limitations](./limitations.md)**: learn about the limitations and important considerations
