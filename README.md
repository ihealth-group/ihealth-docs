# iHealth Docs

Documentação técnica para produtos iHealth, construída com Docusaurus.

## Estrutura do Projeto

### Documentação

A documentação está organizada na pasta `docs/` com a seguinte estrutura:

```
docs/
├── intro.md                     # Página inicial da documentação
├── platform/
│   └── welcome.md               # Boas-vindas da Plataforma iHealth
└── clinical-data-extraction/
    ├── intro.md                 # Introdução à Extração de Dados Clínicos
    ├── data-structure.md        # Estrutura dos dados
    ├── csv-format.md            # Formato CSV
    ├── jsonl-format.md          # Formato JSONL
    ├── delivery.md              # Entrega dos dados em lotes
    ├── analysis-guidelines.md   # Diretrizes de análise
    ├── limitations.md           # Limitações e considerações
    └── v1/                      # Documentação v1 (extrações até 20/09/2026), fora do menu
```

### Configuração

- **docusaurus.config.js**: Configuração principal com branding iHealth
- **sidebars.js**: Navegação lateral da documentação
- **i18n/en/**: Versão em inglês (veja [Idiomas](#idiomas))

## Idiomas

O site usa o i18n nativo do Docusaurus. O português é o idioma padrão e fica na raiz (`/`); o inglês fica em `/en/`. O seletor de idioma aparece no canto direito do navbar.

```
i18n/en/
├── docusaurus-plugin-content-docs/
│   ├── current/                 # Páginas em inglês, com os mesmos caminhos de docs/
│   └── current.json             # Rótulos das categorias da sidebar
└── docusaurus-theme-classic/
    ├── navbar.json              # Itens do navbar
    └── footer.json              # Links do rodapé
```

A tagline e o copyright ficam no `docusaurus.config.js`, escolhidos pela variável `DOCUSAURUS_CURRENT_LOCALE`.

### Ao alterar uma página

Toda alteração em `docs/` precisa da alteração equivalente no arquivo de mesmo caminho em `i18n/en/docusaurus-plugin-content-docs/current/`. Uma página sem arquivo em inglês aparece em português no site em inglês. Hoje todas as páginas, inclusive a v1, têm versão em inglês.

Regras da tradução:

- **Manter como está**: nomes de campos, valores de enum (`PRESENT`, `BIOMARKER`), valores dos dados (`Público`, `câncer de mama`), strings usadas em filtros de código e o front matter de navegação (`slug`, `id`, `pagination_*`). Os dados entregues são em português.
- **Exemplos clínicos**: manter o texto original e colocar a tradução em itálico, por exemplo `"Paciente nega hipertensão" (_patient denies hypertension_)`.
- **IDs dos títulos**: todo título tem ID explícito (`## Visão Geral {#visão-geral}`), e a página em inglês usa o mesmo ID. Assim os links com `#` funcionam nos dois idiomas. Em um título novo, rode `npm run write-heading-ids -- . docs` antes de traduzir.
- **Links para uma página sem tradução**: o Docusaurus não resolve links `.md` entre `docs/` e `i18n/`, e o build quebra. Se uma página ficar sem versão em inglês, os links entre ela e páginas traduzidas precisam usar o caminho de URL absoluto (`/clinical-data-extraction/intro`), como fazem hoje os links "versão atual" da v1.

Ao adicionar um item ao navbar, ao rodapé ou uma categoria na sidebar, rode `npm run write-translations:en` e traduza as chaves novas nos JSON. Não use o `write-translations` direto: ele grava no `footer.json` o copyright em português com o ano fixo, que passa por cima do copyright do config, e cria um `code.json` desnecessário. O script `write-translations:en` desfaz os dois ([scripts/clean-en-translations.mjs](scripts/clean-en-translations.mjs)).

### Desenvolvimento por idioma

`npm start` abre só o português. Para o inglês:

```bash
npm start -- --locale en
```

O `npm run build` gera os dois idiomas.

## Como Executar

### Desenvolvimento

```bash
npm start
```

### Build de Produção

```bash
npm run build
```

### Servir Build Local

```bash
npm run serve
```

## Personalização

### Cores e Estilos

Personalize as cores e estilos em:

- `src/css/custom.css` - Estilos customizados
- `docusaurus.config.js` - Configurações do tema

## Estrutura da Documentação

A navegação lateral é configurada no `sidebars.js` e organiza a documentação em duas categorias.

### Plataforma iHealth

Apresentação da plataforma: interface, modelos de IA, busca estruturada, análise de funil, protocolos e tour pelos módulos.

- **Boas-vindas**: `docs/platform/welcome.md`

### Extração de Dados Clínicos

A documentação da Extração de Dados Clínicos está dividida nas seções abaixo, na mesma ordem do menu lateral:

1. **Introdução**: Visão geral do produto
2. **Estrutura dos Dados**: Campos e categorias disponíveis
3. **Formato CSV**: Como trabalhar com dados em CSV
4. **Formato JSONL**: Como trabalhar com dados em JSONL
5. **Entrega dos Dados**: Como os dados são entregues em lotes
6. **Diretrizes de Análise**: Boas práticas e exemplos
7. **Limitações**: Considerações importantes

#### Documentação v1 (temporária)

`docs/clinical-data-extraction/v1/` guarda a documentação das extrações entregues até 20/09/2026. As páginas ficam fora do `sidebars.js` e navegam entre si por `pagination_prev`/`pagination_next`. Recebem apenas correções e serão removidas no futuro.

## Adicionando Nova Documentação

Para adicionar documentação de novos produtos:

1. Crie uma nova pasta em `docs/` (ex: `docs/novo-produto/`)
2. Adicione os arquivos de documentação
3. Atualize o `sidebars.js` para incluir a nova seção
4. Atualize a navegação no `docusaurus.config.js` se necessário

## Deploy

O projeto está configurado para deploy em:

- **GitHub Pages**: Configurado no `docusaurus.config.js`
- **URL**: `https://docs.ihealthgroup.com.br`

Para fazer deploy:

```bash
npm run deploy
```

## Contribuição

1. Faça suas alterações
2. Teste localmente com `npm start`
3. Faça commit das alterações
4. Push para o repositório

## Suporte

Para dúvidas sobre a documentação:

- Consulte a [documentação do Docusaurus](https://docusaurus.io/docs)
- Abra uma issue no repositório
- Contate a equipe de desenvolvimento

---
