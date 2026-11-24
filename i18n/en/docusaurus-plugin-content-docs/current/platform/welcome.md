---
id: welcome
title: Welcome
sidebar_label: Welcome
description: Introducing the new iHealth platform — the redesigned interface, the evolution of the AI models and a tour of the modules.
hide_title: true
---

# The new iHealth platform

Much of the richest clinical information is written as free text: progress notes, reports, discharge summaries, consultation notes. The iHealth platform reads these documents with artificial intelligence models, structures and normalizes what is inside them, and puts all of it within reach in clinical language — so you can build cohorts, assess feasibility and support real-world analyses, from rare diseases to an institution's care profile.

In this version, the platform gets a new interface and an even sharper clinical reading layer. Everything you already did is still here: structured search, protocols and dashboards.

---

## What's new {#o-que-há-de-novo}

### A lighter, more direct interface {#uma-interface-mais-leve-e-direta}

The product was redesigned from the ground up, with a focus on clarity and workflow.

- **Simpler navigation** — the workspace brings together General dashboard, Structured search, Funnel analysis and Clinical protocols in a sidebar you can collapse.
- **Roomier screens** — larger charts, readable tables, filters always at hand.
- **Smoother experience** — screens load in parts, filters narrow the results without rerunning the search, and going back from a patient returns you exactly where you were.
- **Help where you need it** — the help icon in the search opens the guidance without taking you off the screen.

### Funnel analysis {#análise-de-funil}

A new module available in this version. When a single set of criteria does not describe the cohort, the funnel builds it in steps and shows the count at each one — the shape of a study eligibility criterion.

### Even sharper AI models {#modelos-de-ia-ainda-mais-apurados}

Our extraction and normalization models evolve continuously. In this version they were **retrained on a larger, more representative sample of real texts**, which translated into metric gains on three fronts:

**1. Entity capture.** Clinical vocabulary never stands still: new therapies arrive, nomenclature is updated, acronyms come into common use. The expanded sample keeps up with this, and the model now recognizes a larger set of terms — including recent drugs.

**2. Context assertion.** Each mention is classified by the role it plays in the text, with greater precision. The set gained **Family history**, and what used to be _Possible_ is now called **Under investigation** — to cover hypotheses and suspicions however the text phrases them.

**3. Relations between entities.** The model links one term to another with more confidence: the disease to the organ, the procedure to the anatomy where it was performed, the drug to the condition it may treat, the disease to the biomarker and the stage. Reading a document becomes more connected, and the patient journey easier to follow.

Along with this, **the list of categories was revised** and now brings together the ones that best support a research criterion in practice.

### What you gain {#o-que-você-ganha-com-isso}

- **More reach** — searches that keep up with the language used in medical records, including the most current vocabulary.
- **More control** — contexts that let you ask about the journey: what the patient has now, what they had before, what is under investigation, what was ruled out and what comes from the family.
- **More depth** — relations that show how terms connect within the document, not just that they appear.
- **More visibility** — the funnel shows the cohort size at each step of the criterion, not only in the final result.

In practice: cohorts that fit the clinical question more closely, a journey reading you can stand behind in a study, and the count at each step of the criterion in plain view.

---

## What changed {#o-que-mudou}

If you already used the platform, categories and contexts were reorganized to better reflect how clinical text describes the patient. Search and protocols follow this taxonomy.

### Contexts {#contextos}

The role of each mention in the text is now more precise — and the set changed in two places:

| Before   | Now                            | What it means                                                                         |
| -------- | ------------------------------ | ------------------------------------------------------------------------------------- |
| Possible | **Under investigation**        | Covers hypotheses, suspicions and diagnoses being worked up, however they are phrased |
| —        | **Family history** _(new)_     | Distinguishes a relative's history from the patient's own condition                   |

**Present**, **History** and **Absent** remain.

### Categories {#categorias}

The list now brings together the categories that best support a research criterion:

| Before              | Now                               | What it means                                                                                                                                                           |
| ------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Symptoms            | **Finding**                       | Brings together what the patient reports and what the physical exam describes — a single place for symptoms and findings                                                |
| Vital signs         | _category removed_                | Point measurements change all the time, and capturing specific values did not support a research criterion                                                             |
| Ventilatory support | **Medical device** or **Procedure** | The text decides: a ventilator or a CPAP goes under **Medical device**; ventilation described as an act — manual ventilation, for example — goes under **Procedure**. |

The other categories — disease, drug, procedure, lab test, biomarker and the rest of the search table — stay the same.

### Saved protocols {#protocolos-já-salvos}

Protocols that used removed or reorganized categories **were adjusted** to the new taxonomy and keep working normally.

The counts, however, will be updated. Entity capture has improved — more terms recognized, more precise context — and cohort numbers now reflect this reading. If a protocol's size changes, it reflects the more complete extraction, not a broken criterion.

---

## Tour of the modules {#tour-pelos-módulos}

The menu, filters and some breakdowns depend on your account's permissions. If something described here does not appear on your screen, that is why — not an error. Clinical text and patient identification are sensitive data and are restricted to hospital access.

### General dashboard {#painel-geral}

A snapshot of the database available for research: how many patients, how many clinical documents, the coverage over time.

The filters at the top apply to all charts at once — and you can also **click a chart segment** to narrow the screen by it. It is a good place to start: before building a criterion, look at the size and shape of the available population.

### Structured search {#busca-estruturada}

The starting point of any cohort. You describe the patient you are looking for in clinical language, and the platform searches for those terms in the **text of the clinical documents**.

The screen has two eligibility columns:

- **Must have** — the patient must match.
- **Must not have** — the patient is excluded if they match.

Each criterion starts with the term's **category**. The clinical documents are in Portuguese, so search terms are written in Portuguese; in the examples below, the English in parentheses only shows what each term means.

| Category       | What it represents                           | Examples                                                                                        |
| -------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Finding        | Reported symptoms and physical exam findings | Dor de cabeça (_headache_), Febre (_fever_), Edema                                              |
| Injury         | Physical injuries or poisonings              | Fratura (_fracture_), Queda (_fall_), Alergia (_allergy_)                                       |
| Disease        | Medical or pathological conditions           | Diabetes, Hipertensão (_hypertension_), Neoplasia (_neoplasm_)                                  |
| Drug           | Substances used in treatment                 | Dipirona (_dipyrone_), Cefepime, Morfina (_morphine_)                                           |
| Procedure      | Diagnostic or therapeutic procedures         | Tomografia (_CT scan_), Biópsia (_biopsy_), Quimioterapia (_chemotherapy_)                      |
| Lab test       | Laboratory test results                      | Hemograma (_complete blood count_), glicemia em jejum (_fasting glucose_)                       |
| Biomarker      | Biological indicators of health or disease   | KI67, HER2, PSA, EGFR                                                                           |
| Stage          | Stage of a condition                         | EC IV, EC IIA (_stage IV, stage IIA_)                                                           |
| Scale          | Standard assessment scales                   | ECOG, Glasgow, RASS                                                                             |
| Medical device | Devices and equipment used in care           | Cateter venoso (_venous catheter_), Dreno (_drain_), Ventilação mecânica (_mechanical ventilation_) |
| Body part      | Organs and anatomical components             | Mama (_breast_), Pulmão (_lung_), Próstata (_prostate_)                                         |

**Write the way the medical record is written.** Use synonyms, acronyms and abbreviations. Several terms in the same criterion, separated by semicolons (`diabetes tipo 2; DM2`), are always alternatives to each other.

Between one criterion and the next you choose **AND** (all must be met — narrows) or **OR** (one is enough — broadens). The cohort becomes more specific as you require **distinct** clinical criteria with **AND**, not as you pile synonyms onto the same card.

Two categories have extra fields: **Biomarker** accepts a result and a numeric value; **Lab test** accepts a minimum and maximum range.

#### Term context {#contexto-do-termo}

For Finding, Injury, Disease, Drug, Procedure and Medical device, you can require **the context in which** the term must appear in the text:

| Context                 | When to use                                            |
| ----------------------- | ------------------------------------------------------ |
| **Present**             | The condition is active in the patient at that time    |
| **Under investigation** | Hypothesis or diagnosis being worked up, not confirmed |
| **History**             | Present in the past, may no longer be active           |
| **Family history**      | Refers to a relative, not the patient                  |
| **Absent**              | The term appears negated in the text                   |

Leaving the context blank accepts any of them. This is where the model improvements pay off most: you can ask about the **journey**, not just whether the term is present.

#### Complementary filters {#filtros-complementares}

They narrow by structured encounter data: period, sex, age, death, payer source type, region, state, hospital network, institution and origin. Hospital network, institution and origin filters only appear according to your permissions and when the database has data for them. Without permission to see the institution name, the platform shows the provider type instead.

**Recent searches** keep what you ran in the last three days.

### Results {#resultados}

After searching — or when opening a protocol — the cohort appears in two tabs.

**Analytics** shows the cohort size (patients, documents, institutions, states) and the charts: demographics, monthly distribution, location and clinical mentions (diseases, findings, medications, procedures, lab tests and biomarkers).

:::note
Mention charts count **patients who have that mention**. The same patient appears under several terms — use the list to compare relevance, never to add up the cohort size.
:::

**Patient details** lists the cohort with institution, sex, age and death. Export generates a CSV of the list and, in a protocol, an XLSX of the marked patients. Patient identification, marking in the protocol and exporting the selected list are restricted to hospital access; with datalake access, the reading stays aggregated and de-identified.

Filtering or clicking a chart narrows the results **without rerunning the search**. And at any time, you can save the search as a protocol or reuse the criteria to start another one.

### Patient and clinical document {#paciente-e-documento-clínico}

:::note Available with hospital access
The patient record and the text of the clinical document are sensitive data and are available to users with hospital access. With datalake access, analysis happens at the aggregate level — cohort, charts and distribution — without opening the individual record.
:::

This is where the clinical reading becomes visible.

The patient record shows the **timeline** of documents, with the mentions of each category on each date, and the **Top occurrences** cloud, which can be filtered by context. You can ask for all documents, only those that match at least one search criterion, or only those that match all of them.

When you open a document, the text is on the left with entities colored by category, and on the right is the list of entities, grouped by category. For each term you see the context, its own details (value, status, marker, method, score), the mention's attributes (date, value) and its **relations with other terms** — anatomic site, target anatomy, may treat, associated disease, biomarker, scale, staging, associated device, oncologic finding.

Clicking a term in the list highlights the matching passage in the text.

### Funnel analysis {#análise-de-funil-1}

When the cohort cannot be described by a single set of criteria, the funnel builds it in **sequential levels**: each level filters only those who made it through the previous one. The first level is the database available to your access — your 100%.

At each level you use the same criteria and filters as the search, and you can **import a clinical protocol** — the eligibility criteria only, or everything. The table shows how many patients and institutions remain at each step and what share of the level above that represents.

It is the natural shape of a **study eligibility criterion**: target population, diagnosis, prior treatment, exclusions — each step with its own count.

### Clinical protocols {#protocolos-clínicos}

A protocol is a saved search: the criteria are stored so you can reopen the cohort, follow how it grows and share it with your team.

The list is organized into **My protocols**, **Shared with me**, **Favorites** and **Special protocols**. On each card you can favorite, turn on notifications, share with colleagues, edit, delete or reuse the criteria in a new search.

**Notifications.** With notifications turned on for a protocol, you get a daily email with patient movement in that cohort — no need to reopen the platform to find out that something changed. This is the feature that keeps a cohort alive between one analysis and the next.

**Sharing.** Sharing is an action within the platform: you choose people by name or email, and the protocol starts appearing for them in the _Shared with me_ tab. The same screen shows who already has access and lets you remove it.

This is the module that turns a one-off query into **cohort follow-up over time** — central to longitudinal studies and to monitoring eligibility.

---

## An end-to-end flow {#um-fluxo-de-ponta-a-ponta}

```text
General dashboard   →  size up the available database
Structured search   →  describe the patient in clinical language
Search results      →  read the cohort, narrow it with the charts
Patient             →  with hospital access, confirm in the clinical document
Funnel analysis     →  formalize the criteria in levels, with the count at each one
Save protocol       →  follow and share the cohort
```

Search and protocol open exactly the same results screen, and the page URL keeps track of where you came from — which makes it easy to navigate and go back without losing context.

**To take a cohort to someone else, use a protocol.** Save the search as a protocol and use the **Share** action to give access to whoever needs it: that is the only way the protocol appears for that person, in the _Shared with me_ tab. Sending the URL some other way does not grant access.

---

## Tips to get more out of search {#dicas-para-tirar-mais-da-busca}

- **Think about the clinical criterion first**, then about registration and institution filters.
- **Synonyms and acronyms go together** in the same criterion; different requirements go in separate criteria, joined by **AND**.
- **Use context when the question depends on it** — only **Present** if you want neither history nor hypotheses; **Under investigation** for hypotheses and suspicions; **Absent** to exclude what was explicitly negated.
- **Start broad and tighten.** Run the search, look at the cohort size and add one criterion at a time: it is the fastest way to understand the effect of each requirement.
- **Save early.** A protocol costs nothing and saves you from rebuilding the same search the following week.

---

## What's coming {#o-que-vem-por-aí}

This version makes room for the next step. With a richer, more connected clinical database, we are working on **more advanced ways to build cohorts** — combinations that today require several searches — and on **deeper analyses of the population found**.

Along the same path come new layers of artificial intelligence and additional normalizations of clinical data, so that every question you ask the platform gets a more complete answer.
