// Runs after `docusaurus write-translations --locale en` (see the
// "write-translations:en" script in package.json) and undoes two side effects:
//
// 1. write-translations adds a "copyright" key to footer.json with the
//    Portuguese text and a fixed year. The theme prefers that key over
//    themeConfig.footer.copyright, which docusaurus.config.js picks by locale,
//    so the key is removed.
// 2. write-translations creates code.json with the theme's default strings.
//    The site has no custom React strings and Docusaurus already ships these
//    strings in English, so the file is removed. Keep it only if a component
//    starts using <Translate> or translate().

import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const footerPath = "i18n/en/docusaurus-theme-classic/footer.json";
const codePath = "i18n/en/code.json";

const footer = JSON.parse(readFileSync(footerPath, "utf8"));
if ("copyright" in footer) {
  delete footer.copyright;
  writeFileSync(footerPath, JSON.stringify(footer, null, 2) + "\n");
  console.log(`Removed "copyright" from ${footerPath}`);
}

if (existsSync(codePath)) {
  rmSync(codePath);
  console.log(`Removed ${codePath}`);
}
