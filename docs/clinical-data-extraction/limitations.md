# Limitações e Considerações

Esta página descreve as limitações dos dados extraídos e os cuidados necessários para interpretar corretamente os resultados das análises. Recomendamos a leitura antes de qualquer análise.

## Contexto dos Dados Extraídos

> **Importante**: Os dados disponibilizados representam uma seleção específica de nosso banco de dados clínico, processados com técnicas de Processamento de Linguagem Natural (PLN). As limitações descritas abaixo aplicam-se tanto ao processo de extração quanto à seleção dos dados.

## Limitações dos Dados

### 1. Estruturação Automática

Os dados são estruturados automaticamente usando técnicas de PLN, o que pode resultar em:

- **Erros de extração**: algumas entidades podem não ser identificadas corretamente
- **Falsos positivos**: termos podem ser classificados incorretamente
- **Falsos negativos**: entidades importantes podem ser perdidas
- **Inconsistências**: mesmo termo pode ser extraído de forma diferente em contextos similares

### 2. Cobertura dos Dados

- **Documentos não processados**: nem todos os documentos podem ter entidades extraídas
- **Cobertura temporal**: dados representam apenas o período disponível na base de dados
- **Cobertura geográfica**: limitada aos provedores participantes do sistema
- **Cobertura de especialidades**: pode variar entre diferentes áreas médicas

### 3. Qualidade da Extração

#### Limitações por Categoria

| Categoria   | Limitações Principais                                  |
| ----------- | ------------------------------------------------------ |
| `DISEASE`   | Pode não capturar todas as condições mencionadas       |
| `FINDING`   | Sintomas subjetivos podem ser perdidos                 |
| `BIOMARKER` | Valores numéricos podem não ser extraídos corretamente |
| `PROCEDURE` | Procedimentos complexos podem ser fragmentados         |

#### Contexto e Campos Estruturados

- **Contexto (`assertion`)**: é inferido automaticamente e pode estar errado, por exemplo, uma suspeita classificada como presente
- **`OTHER`**: menções fora da jornada clínica do paciente (referências, estudos, documentos de apoio) recebem `OTHER` e, em geral, devem ficar fora das análises do paciente
- **Campos estruturados**: só vêm preenchidos quando a normalização foi possível. Um biomarcador ou exame sem `normalized_entity` ou `numeric_value` não significa que o resultado esteja ausente do documento

#### Exemplos de Limitações

**Cobertura de Extração:**

- Diferentes categorias de entidades podem ter taxas de extração variáveis
- Algumas categorias podem ter maior precisão que outras
- É recomendado verificar a distribuição de entidades por categoria antes de análises específicas

### 4. Contexto Clínico

- **Nuances perdidas**: algumas nuances clínicas podem ser perdidas na extração
- **Contexto temporal**: relações temporais entre eventos podem não ser capturadas em todos os casos
- **Gravidade**: níveis de gravidade ou severidade podem não ser capturados
- **Evolução**: mudanças ao longo do tempo podem não ser rastreadas

## Considerações Éticas

### 1. Privacidade e Confidencialidade

- **Dados anonimizados**: IDs são anonimizados, mas mantenha confidencialidade
- **Uso responsável**: use dados apenas para fins de pesquisa aprovados
- **Compartilhamento**: não compartilhe dados sem autorização adequada
- **Armazenamento**: mantenha dados em ambientes seguros

### 2. Uso Responsável

- Não tente reidentificar pacientes, profissionais ou provedores
- Não cruze os dados com bases que contenham informações identificadas
- Mantenha registro de acesso e uso dos dados para auditoria

### 3. Transparência

- **Documente limitações**: sempre documente as limitações dos dados
- **Metodologia**: descreva claramente a metodologia utilizada
- **Resultados**: apresente resultados com contexto adequado
- **Revisão**: submeta análises para revisão por pares quando apropriado

## Limitações Técnicas

### 1. Processamento de Linguagem Natural

#### Desafios do PLN

- **Ambiguidade**: termos médicos podem ter múltiplos significados
- **Contexto**: significado pode depender do contexto clínico
- **Linguagem natural**: variações na forma de expressar conceitos
- **Variação de nomenclatura**: o mesmo conceito pode aparecer com nomes, siglas e abreviações diferentes

#### Exemplo de Ambiguidade

**Termos Ambíguos:**

- Termos como "pressão" podem referir-se a pressão arterial, pressão intracraniana, ou outros contextos
- A mesma entidade pode ser classificada em diferentes categorias dependendo do contexto
- É importante revisar manualmente amostras de dados para identificar possíveis ambiguidades

### 2. Estrutura dos Dados

- **CSV**: perde a estrutura hierárquica original dos dados
- **JSONL**: é mais complexo para análises simples e estatísticas básicas
- **Campos vazios**: nem todos os campos são preenchidos para todas as entidades, e a completude varia por tipo de entidade. Trate campo vazio como "informação não disponível" e verifique a completude dos campos essenciais para a sua análise antes de começar

### 3. Performance e Escalabilidade

- **Tamanho dos arquivos**: arquivos grandes podem ser difíceis de processar
- **Memória**: análises complexas podem requerer muita memória
- **Tempo de processamento**: algumas análises podem ser computacionalmente intensivas

## Recomendações {#recomendacoes}

### 1. Validação Clínica

- Valide os resultados com base em conhecimento clínico estabelecido
- Consulte especialistas clínicos para validar achados inesperados
- Revise manualmente uma amostra das entidades extraídas antes de conclusões importantes

**Exemplos de Validação:**

- Comparar a prevalência das doenças na coorte com a descrita na literatura para populações semelhantes
- Conferir se os fármacos ligados a uma doença por `may_treat` correspondem a tratamentos conhecidos
- Verificar se os valores de exames estão em faixas plausíveis para a unidade informada

### 2. Análise Exploratória

- **Comece simples**: inicie com análises descritivas básicas
- **Explore gradualmente**: aumente complexidade gradualmente
- **Documente descobertas**: mantenha registro de insights
- **Valide hipóteses**: teste hipóteses com dados adicionais

### 3. Documentação

Registre em cada análise:

- identificação, data e analista responsável
- objetivo e metodologia
- versão dos dados utilizados (data de entrega e lotes)
- limitações reconhecidas e status da validação clínica
- ferramentas e pacotes utilizados, com versões
- principais resultados, interpretações e próximos passos

### 4. Reprodutibilidade

- **Versionamento**: use controle de versão para código e dados
- **Ambiente**: documente ambiente de execução
- **Seeds**: use seeds fixos para análises aleatórias
- **Dependências**: mantenha registro de versões de pacotes

## Contato e Suporte

Para dúvidas sobre limitações ou considerações:

- **Contato**: [oportunidades@ihealthgroup.com.br](mailto:oportunidades@ihealthgroup.com.br)
- **Suporte Clínico**: consulte especialistas para validação
