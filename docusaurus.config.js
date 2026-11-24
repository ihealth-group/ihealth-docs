// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Locale being built ("pt" or "en"). Used for config values that the
// i18n JSON files don't cover (tagline) or that a JSON file would freeze
// (the copyright year).
const currentLocale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? "pt";

const taglines = {
  pt: "Documentação técnica para produtos iHealth",
  en: "Technical documentation for iHealth products",
};

const year = new Date().getFullYear();
const copyrights = {
  pt: `Copyright © ${year} iHealth. Todos os direitos reservados.`,
  en: `Copyright © ${year} iHealth. All rights reserved.`,
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "iHealth Docs",
  tagline: taglines[currentLocale] ?? taglines.pt,
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://docs.ihealthgroup.com.br",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For custom domain deployment, baseUrl should be "/"
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "ihealth-group", // Usually your GitHub org/user name.
  projectName: "ihealth-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Portuguese is served at the site root and English under /en/.
  // English pages live in i18n/en/ (see README).
  i18n: {
    defaultLocale: "pt",
    locales: ["pt", "en"],
    localeConfigs: {
      pt: { label: "Português", htmlLang: "pt-BR" },
      en: { label: "English", htmlLang: "en-US" },
    },
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          routeBasePath: "/", // Serve docs at the site's root
          // Removido editUrl para ocultar o link "Editar esta página"
        },
        blog: false, // Desabilitar blog por enquanto
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/ihealth-social-card.png",
      navbar: {
        // title: "iHealth Docs",
        logo: {
          alt: "iHealth Logo",
          src: "img/logo-ihealth.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docsSidebar",
            position: "left",
            label: "Documentação de produtos",
          },
          {
            type: "localeDropdown",
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
          {
            title: "Documentação",
            items: [
              {
                label: "Introdução",
                to: "/",
              },
              {
                label: "Plataforma iHealth",
                to: "/platform/welcome",
              },
              {
                label: "Extração de Dados Clínicos",
                to: "/clinical-data-extraction/intro",
              },
            ],
          },
          {
            title: "iHealth",
            items: [
              {
                label: "Acessar a Plataforma",
                href: "https://plataforma.ihealthgroup.tec.br/",
              },
              {
                label: "Website",
                href: "https://ihealthgroup.com.br/",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/ihealth-group/",
              },
            ],
          },
        ],
        copyright: copyrights[currentLocale] ?? copyrights.pt,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
