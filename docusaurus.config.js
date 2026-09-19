// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "iHealth Docs",
  tagline: "Documentação técnica para produtos iHealth",
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

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "pt",
    locales: ["pt"],
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
                to: "/plataforma/boas-vindas",
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
                label: "Website",
                href: "https://www.ihealthgroup.com.br/",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/ihealth-group/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} iHealth. Todos os direitos reservados.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
