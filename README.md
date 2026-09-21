# iHealth Docs

Documentação técnica para produtos iHealth, construída com Docusaurus.

## Estrutura do Projeto

### Documentação

A documentação está organizada na pasta `docs/` com a seguinte estrutura:

```
docs/
├── intro.md                     # Página inicial da documentação
├── plataforma/
│   └── boas-vindas.md           # Boas-vindas da Plataforma iHealth
└── clinical-data-extraction/
    ├── intro.md                 # Introdução à Extração de Dados Clínicos
    ├── data-structure.md        # Estrutura dos dados
    ├── delivery.md              # Entrega dos dados em lotes
    ├── csv-format.md            # Formato CSV
    ├── jsonl-format.md          # Formato JSONL
    ├── analysis-guidelines.md   # Diretrizes de análise
    └── limitations.md           # Limitações e considerações
```

### Configuração

- **docusaurus.config.js**: Configuração principal com branding iHealth
- **sidebars.js**: Navegação lateral da documentação

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

- **Boas-vindas**: `docs/plataforma/boas-vindas.md`

### Extração de Dados Clínicos

A documentação da Extração de Dados Clínicos está dividida em seções lógicas:

1. **Introdução**: Visão geral do produto
2. **Entrega dos Dados**: Como os dados são entregues em lotes
3. **Formato CSV**: Como trabalhar com dados em CSV
4. **Formato JSONL**: Como trabalhar com dados em JSONL
5. **Estrutura dos Dados**: Campos e categorias disponíveis
6. **Diretrizes de Análise**: Boas práticas e exemplos
7. **Limitações**: Considerações importantes

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
