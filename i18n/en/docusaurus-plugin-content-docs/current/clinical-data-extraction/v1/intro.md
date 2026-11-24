---
displayed_sidebar: docsSidebar
pagination_prev: null
pagination_next: clinical-data-extraction/v1/data-structure
---

# Clinical Data Extraction

:::caution v1 documentation
This documentation covers extractions delivered **up to September 20, 2026**. See the [current version](/clinical-data-extraction/intro).
:::

:::note Language of the data
The clinical documents are Brazilian, so the extracted values (such as `entity`, `normalized_entity`, `term_desc` and `provider_type`) and, in v1, the `assertion` values are in Portuguese. The examples in this documentation keep them in Portuguese, exactly as they appear in the files.
:::

## Overview {#visão-geral}

iHealth's **Clinical Data Extraction** is a product that delivers structured data extracted from our clinical database, with broad national coverage, good representativeness for studies and projects, and providers in every region of Brazil. The extraction is customized according to specific criteria defined by the contracting client.

## What is Clinical Data Extraction? {#o-que-é-a-extração-de-dados-clínicos}

Our data extraction is a structured selection from our clinical database that:

- **Selects patients** based on specific criteria (diagnoses, medications, procedures, etc.)
- **Structures clinical data** in standardized formats for analysis
- **Preserves clinical context**, keeping the relations between entities and documents
- **Offers flexibility**, with multiple delivery formats
- **Maintains anonymization**, protecting patient privacy

## Delivery Formats {#formatos-de-disponibilização}

The extracted data is delivered in two main formats, organized in **file batches** to make processing easier:

### CSV {#csv}

- **Granularity**: each row = 1 clinical entity
- **Structure**: "flattened" data in columns
- **Recommended use**: statistical analyses, aggregations by entity type, exploratory analyses
- **Delivery**: files in batches of 10-50 patients each

### JSONL {#jsonl}

- **Granularity**: each line = 1 complete document
- **Structure**: nested data preserving the hierarchy
- **Recommended use**: document-level analyses, preserving clinical context, patient journey analyses
- **Delivery**: files in batches of 10-50 patients each

> **Important**: the number of rows per file varies with the number of clinical documents available for each patient in the database. For full details on the delivery structure, see the [Data Delivery](./delivery.md) section.

## Audience {#público-alvo}

This documentation is intended for:

- **Data Scientists** who will work with the extracted data in a range of analyses
- **Data Analysts** who need to understand the structure and possibilities of the data
- **Researchers** who will use the data in clinical and RWE (Real World Evidence) studies
- **Business Intelligence Teams** who will integrate the data into dashboards and reports

## Next Steps {#próximos-passos}

1. **[Data Structure](./data-structure.md)** - Understand how the extracted data is organized
2. **[CSV Format](./csv-format.md)** - Learn how to work with data in CSV
3. **[JSONL Format](./jsonl-format.md)** - Explore the JSONL structure
4. **[Data Delivery](./delivery.md)** - Learn how the data is delivered in batches and how to process it
5. **[Analysis Guidelines](./analysis-guidelines.md)** - Best practices for analyzing the extracted data
6. **[Limitations](./limitations.md)** - Learn about the limitations and important considerations

---

_This documentation was created to help data analysts and scientists use the data extracted from iHealth's clinical database._
