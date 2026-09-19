---
id: boas-vindas
title: Boas-vindas
sidebar_label: Boas-vindas
description: Apresentação da nova plataforma iHealth — a interface renovada, a evolução dos modelos de IA e um tour pelos módulos.
hide_title: true
---

# A nova plataforma iHealth

Grande parte da informação clínica mais rica está escrita em texto livre: evoluções, laudos, sumários de alta, pareceres. A plataforma iHealth lê esses documentos com modelos de inteligência artificial, estrutura e normaliza o que está ali dentro, e coloca tudo isso ao seu alcance em linguagem clínica — para você montar coortes, explorar populações e sustentar análises.

Nesta versão, a plataforma ganha uma interface nova e uma camada de leitura clínica ainda mais apurada. Tudo o que você já fazia continua aqui: busca estruturada, protocolos, funil e painéis.

---

## O que há de novo

### Uma interface mais leve e direta

O produto foi redesenhado por inteiro, com foco em clareza e ritmo de trabalho.

- **Navegação mais simples** — o workspace reúne Painel Geral, Busca estruturada, Análise de Funil e Protocolos clínicos em uma barra lateral que você pode recolher.
- **Telas mais respiráveis** — gráficos maiores, tabelas legíveis, filtros sempre à mão.
- **Mais fluidez** — as telas carregam por partes, os filtros recortam o resultado sem refazer a busca, e voltar de um paciente devolve você exatamente onde estava.
- **Ajuda no lugar certo** — o ícone de ajuda na busca abre as orientações sem tirar você da tela.

### Modelos de IA ainda mais apurados

Nossos modelos de extração e normalização evoluem continuamente. Nesta versão eles foram **retreinados sobre uma amostra maior e mais representativa de textos reais**, e isso se traduziu em ganhos de métrica em três frentes:

**1. Captura de entidades.** O vocabulário clínico não para: terapias novas chegam, nomenclaturas se atualizam, siglas entram no uso corrente. A amostra ampliada acompanha esse movimento, e o modelo passa a reconhecer um conjunto maior de termos — inclusive medicamentos recentes.

**2. Asserção de contexto.** Cada menção é classificada segundo o papel que tem no texto, com precisão maior. E o conjunto ganhou um contexto novo: **Histórico familiar**, que distingue o antecedente de um parente da condição do próprio paciente — um recorte a mais à sua disposição na hora de montar o critério.

**3. Relações entre entidades.** O modelo liga com mais confiança um termo a outro: a doença ao órgão, o procedimento à anatomia em que foi feito, o fármaco à condição que ele pode tratar, a doença ao biomarcador e ao estadiamento. A leitura do documento fica mais conectada, e a jornada do paciente, mais fácil de acompanhar.

Junto com isso, **a lista de categorias foi revisada** e passa a reunir as que mais sustentam um critério de pesquisa na prática.

### O que você ganha com isso

- **Mais alcance** — buscas que acompanham a linguagem corrente dos prontuários, incluindo o vocabulário mais atual.
- **Mais controle** — contextos que permitem perguntar pela jornada: o que o paciente tem agora, o que já teve, o que está em investigação, o que foi descartado e o que vem da família.
- **Mais profundidade** — relações que mostram como os termos se conectam dentro do documento, não apenas que eles aparecem.

Na prática: coortes mais aderentes à pergunta clínica e uma leitura de jornada que você consegue sustentar em um estudo.

---

## Para que usar a plataforma

A plataforma foi feita para quem precisa transformar informação clínica em população de estudo.

- **RWE / RWD** — descrever como uma doença se comporta fora do ensaio clínico: perfil dos pacientes, linha de tratamento praticada, tempo entre eventos, desfecho registrado.
- **Viabilidade e recrutamento** — antes de abrir um estudo, saber quantos pacientes atendem aos critérios, em quais instituições, em quais estados.
- **Doenças raras** — onde a leitura de texto rende mais: o diagnóstico costuma estar na narrativa do documento, não em um código administrativo. Sinônimos, siglas e contexto fazem diferença.
- **Novos medicamentos** — mapear população elegível, uso real de fármacos e o que se registra em torno deles.
- **Epidemiologia hospitalar** — para a instituição, entender o próprio perfil assistencial: quem atende, em que setor, com que fonte pagadora, ao longo do tempo.
- **Estratificação por biomarcador e estadiamento** — recortar a coorte por resultado, faixa de valor e estágio, que são campos próprios na busca.

---

## Seu acesso: o que você vê

A plataforma serve a dois públicos, e a tela se ajusta ao seu acesso. Se algo descrito aqui não aparecer para você, quase sempre é por isso: o menu e alguns filtros mudam conforme a permissão. Se a tela não corresponder ao que você espera, fale com quem administra a sua conta.

### Acesso ao datalake completo — indústria farmacêutica e consultorias

Você enxerga a **base inteira**, agregada por rede, instituição, região e estado. A ênfase é populacional: dimensionar coorte, comparar territórios, avaliar viabilidade.

- Painel Geral na visão **Rede / datalake**, com mapa, pirâmide etária, fonte pagadora e a lista completa de instituições da base.
- Busca, funil e protocolos sobre toda a base.
- Análise sobre **dados agregados e desidentificados**: a leitura é de população, não de indivíduo.
- O nome da instituição depende do seu contrato. Sem essa permissão, a plataforma mostra o **tipo de prestador** no lugar do nome, e os filtros de rede, instituição e setor não aparecem.

### Acesso hospitalar — instituições de saúde

Você enxerga o **recorte da sua instituição**, com o detalhe assistencial que a visão populacional não comporta.

- Painel Geral na visão **Hospital**: tipo de atendimento, setor de origem, fonte pagadora e a distribuição de pacientes por mês.
- Busca, funil e protocolos sobre a base do hospital.
- **Identificação do paciente disponível**, com marcação de pacientes no protocolo e exportação da lista selecionada.
- **Acesso ao documento clínico completo**, com o texto e as entidades extraídas dele.
- Nome de instituição e setor visíveis nos filtros e nas tabelas.

:::info Por que a tela muda
O que você acessa vem da permissão da sua conta. O texto clínico e a identificação do paciente são dado sensível, e por isso ficam restritos a quem tem vínculo assistencial com aquele registro — hoje, o acesso hospitalar. Nada do que você vê está incompleto por erro.
:::

---

## Tour pelos módulos

### Painel Geral

O retrato da base disponível para pesquisa: quantos pacientes, quantos documentos clínicos, quantas instituições, desde quando há cobertura.

Os filtros do topo valem para todos os gráficos ao mesmo tempo — e você também pode **clicar em um segmento do gráfico** para recortar a tela por ele. É um bom lugar para começar: antes de montar critério, veja o tamanho e a forma da população disponível.

### Busca estruturada

O ponto de partida de qualquer coorte. Você descreve o paciente que procura em linguagem clínica, e a plataforma procura esses termos no **texto dos documentos clínicos**.

A tela tem duas colunas de elegibilidade:

- **Deve ter** — o paciente precisa corresponder.
- **Não pode ter** — o paciente é excluído se corresponder.

Cada critério começa pela **categoria** do termo:

| Categoria | O que representa | Exemplos |
| --- | --- | --- |
| Achado clínico | Sintomas e achados do exame físico | Dor de cabeça, Febre, Edema |
| Lesão | Lesões físicas ou envenenamentos | Fratura, Queda, Alergia |
| Doença | Condições médicas ou patológicas | Diabetes, Hipertensão, Neoplasia |
| Fármaco | Substâncias usadas em tratamento | Dipirona, Cefepime, Morfina |
| Procedimento | Procedimentos diagnósticos ou terapêuticos | Tomografia, Biópsia, Quimioterapia |
| Exame laboratorial | Resultados de testes laboratoriais | Hemograma, glicemia em jejum |
| Biomarcador | Indicadores biológicos de saúde ou doença | KI67, HER2, PSA, EGFR |
| Estadiamento | Estágio de uma condição | EC IV, EC IIA |
| Escala | Escalas padrão de avaliação | ECOG, Glasgow, RASS |
| Dispositivo médico | Dispositivos usados em procedimentos | Cateter venoso, Dreno, Prótese |
| Parte do corpo | Órgãos e componentes anatômicos | Mama, Pulmão, Próstata |

**Escreva como o prontuário escreve.** Use sinônimos, siglas e abreviações. Vários termos no mesmo critério, separados por ponto e vírgula (`diabetes tipo 2; DM2`), são sempre alternativos entre si.

Entre um critério e o próximo você escolhe **E** (todos precisam ser atendidos — restringe) ou **OU** (basta um — amplia). A coorte fica mais específica conforme você exige critérios clínicos **distintos** com **E**, não conforme acumula sinônimos no mesmo cartão.

Duas categorias têm campos extras: **Biomarcador** aceita resultado e valor numérico; **Exame laboratorial** aceita faixa mínima e máxima.

#### Contexto do termo

Para Achado clínico, Lesão, Doença, Fármaco, Procedimento e Dispositivo médico, você pode exigir **em que contexto** o termo deve aparecer no texto:

| Contexto | Quando usar |
| --- | --- |
| **Presente** | A condição está ativa no paciente naquele momento |
| **Em investigação** | Hipótese ou diagnóstico em apuração, sem confirmação |
| **Histórico** | Esteve presente no passado, pode não estar mais ativo |
| **Histórico familiar** | Refere-se a um familiar, não ao paciente |
| **Ausente** | O termo aparece negado no texto |

Deixar o contexto em branco aceita qualquer um. É aqui que a evolução dos modelos rende mais: você consegue perguntar pela **jornada**, e não apenas pela presença do termo.

#### Filtros complementares

Recortam por dados estruturados do atendimento: período, sexo, idade, óbito, tipo de fonte pagadora, região, estado, rede, instituição e setor. Alguns só aparecem quando a base tem dado para eles ou conforme a sua permissão.

As **Buscas recentes** guardam o que você rodou nos últimos três dias.

### Resultados

Depois de buscar — ou ao abrir um protocolo — a coorte aparece em duas abas.

**Visão analítica** traz o tamanho da coorte (pacientes, documentos, instituições, estados) e os gráficos: demografia, distribuição mensal, localidade e menções clínicas (doenças, achados, medicamentos, procedimentos, exames e biomarcadores).

:::note
Os gráficos de menção contam **pacientes que têm aquela menção**. Um mesmo paciente aparece em vários termos — use a lista para comparar relevância, nunca para somar o tamanho da coorte.
:::

**Detalhes dos pacientes** lista a coorte com instituição, sexo, idade e óbito. A exportação gera CSV da lista e, no protocolo, XLSX dos pacientes marcados.

Filtrar ou clicar em um gráfico recorta o resultado **sem refazer a busca**. E, a qualquer momento, você pode salvar a busca como protocolo ou reutilizar os critérios para começar outra.

### Paciente e documento clínico

:::note Disponível no acesso hospitalar
O prontuário do paciente e o texto do documento clínico são dado sensível e estão disponíveis para quem tem acesso hospitalar. No acesso ao datalake, a análise acontece no nível agregado — coorte, gráficos e distribuição — sem abrir o registro individual.
:::

É aqui que a leitura clínica fica visível.

O prontuário mostra a **linha do tempo** dos documentos, com as menções de cada categoria em cada data, e a nuvem de **principais ocorrências**, filtrável por contexto. Você pode pedir todos os documentos, só os que batem com ao menos um critério da busca, ou só os que batem com todos.

Ao abrir um documento, o texto fica à esquerda com as entidades coloridas por categoria, e à direita a lista de entidades, agrupada por categoria. Em cada termo você vê o contexto, os detalhes próprios (valor, status, marcador, método, escore), os atributos da menção (data, valor) e as **relações com outros termos** — sítio anatômico, anatomia alvo, pode tratar, doença associada, biomarcador, escala, estadiamento, dispositivo associado, achado oncológico.

Clicar no termo da lista destaca a passagem correspondente no texto.

### Análise de Funil

Quando a coorte não se descreve em um único conjunto de critérios, o funil a constrói em **níveis sequenciais**: cada nível filtra apenas quem sobreviveu ao anterior. O primeiro nível é a rede completa, o seu 100%.

Em cada nível você usa os mesmos critérios e filtros da busca, e pode **importar um protocolo** — só os critérios, ou critérios e filtros. A tabela mostra quantos pacientes e instituições restam a cada etapa e o quanto isso representa do nível acima.

É o desenho natural de um **critério de elegibilidade de estudo**: população-alvo, diagnóstico, tratamento prévio, exclusões — cada passo com o seu número.

### Protocolos clínicos

Um protocolo é uma busca salva: os critérios ficam guardados para reabrir a coorte, acompanhar como ela cresce e compartilhar com a equipe.

A lista se organiza em **Meus protocolos**, **Compartilhados comigo**, **Favoritos** e **Protocolos especiais**. Em cada card dá para favoritar, ativar notificações, compartilhar com colegas, editar, excluir ou reutilizar os critérios em uma busca nova.

**Notificações.** Com elas ativadas no protocolo, você recebe um e-mail diário com a movimentação de pacientes naquela coorte — sem precisar reabrir a plataforma para saber que algo mudou. É o recurso que mantém uma coorte viva entre uma análise e outra.

**Compartilhamento.** Compartilhar é uma ação dentro da plataforma: você escolhe as pessoas pelo nome ou e-mail, e o protocolo passa a aparecer para elas na aba *Compartilhados comigo*. A mesma tela mostra quem já tem acesso e permite removê-lo.

É o módulo que transforma uma consulta pontual em **acompanhamento de coorte ao longo do tempo** — central para estudo longitudinal e para monitorar elegibilidade.

---

## Um fluxo de ponta a ponta

```text
Painel Geral        →  dimensione a base disponível
Busca estruturada   →  descreva o paciente em linguagem clínica
Resultados          →  leia a coorte, recorte pelos gráficos
Paciente            →  no acesso hospitalar, confirme no documento clínico
Análise de Funil    →  formalize os critérios em etapas, com o número de cada uma
Salvar protocolo    →  acompanhe e compartilhe a coorte
```

Busca e protocolo abrem exatamente a mesma tela de resultados, e o endereço da página guarda de onde você veio — o que facilita navegar e voltar sem perder o contexto.

**Para levar uma coorte a outra pessoa, o caminho é o protocolo.** Salve a busca como protocolo e use a ação **Compartilhar** para dar acesso a quem precisa: só assim o protocolo aparece para essa pessoa, na aba *Compartilhados comigo*. Enviar a URL por fora não concede acesso.

---

## Dicas para tirar mais da busca

- **Pense primeiro no critério clínico**, depois nos filtros de cadastro e instituição.
- **Sinônimos e siglas vão juntos** no mesmo critério; exigências diferentes vão em critérios separados, ligados por **E**.
- **Use o contexto quando a pergunta depende dele** — só **Presente** se você não quer histórico nem hipótese; **Ausente** para excluir o que foi explicitamente negado.
- **Comece amplo e vá apertando.** Rode a busca, olhe o tamanho da coorte e acrescente um critério de cada vez: é a forma mais rápida de entender o efeito de cada exigência.
- **Salve cedo.** Um protocolo custa nada e evita remontar a mesma busca na semana seguinte.

---

## O que vem por aí

Esta versão abre espaço para o próximo passo. Com uma base clínica mais rica e mais conectada, estamos trabalhando em **formas mais avançadas de compor coortes** — combinações que hoje exigem várias buscas — e em **análises mais profundas sobre a população encontrada**.

No mesmo caminho seguem novas camadas de inteligência artificial e normalizações adicionais do dado clínico, para que cada pergunta que você faz à plataforma tenha uma resposta mais completa.
