// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  // Sidebar principal para documentação
  docsSidebar: [
    "intro",
    {
      type: "category",
      label: "Extração de Dados Clínicos",
      items: [
        "clinical-data-extraction/intro",
        "clinical-data-extraction/data-structure",
        "clinical-data-extraction/csv-format",
        "clinical-data-extraction/jsonl-format",
        "clinical-data-extraction/delivery",
        "clinical-data-extraction/analysis-guidelines",
        "clinical-data-extraction/limitations",
      ],
    },
  ],
};

export default sidebars;
