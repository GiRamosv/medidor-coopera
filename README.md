Medidor Coopera

Energia inteligente para um consumo mais consciente!

O Medidor Coopera é um projeto desenvolvido para ajudar as pessoas a entender melhor o consumo de energia elétrica de suas casas. Por meio de uma simulação, o sistema calcula o consumo mensal dos aparelhos cadastrados e apresenta uma estimativa dos custos de energia.

A proposta é facilitar o acompanhamento do consumo doméstico e incentivar o uso consciente da eletricidade.

🎯 Objetivo do projeto

Desenvolver uma aplicação web simples e intuitiva que permita cadastrar aparelhos eletrônicos, simular o consumo de energia e visualizar informações importantes para o planejamento do consumo residencial.

⚡ Funcionalidades

📝 Cadastro de aparelhos: informar o nome, a potência em watts, as horas de uso por dia e os dias de utilização no mês.

📊 Simulação de consumo: calcular o consumo mensal de energia dos aparelhos cadastrados.

💰 Estimativa de custos: apresentar o custo estimado da energia e o valor adicional da bandeira tarifária configurada.

☀️ Estimativa de painéis solares: calcular a quantidade estimada de painéis necessários.

🔎 Identificação do aparelho de maior custo: indicar qual aparelho representa o maior custo estimado.

📈 Gráfico de consumo: visualizar a participação de cada aparelho no consumo total.

💾 Armazenamento no navegador: manter a lista de aparelhos salva no navegador por meio do localStorage.

🛠️ Tecnologias utilizadas

Tecnologia

Utilização

HTML5

Estrutura da página

CSS3

Estilização e organização visual

JavaScript

Interações e funcionalidades do site

Node.js

Execução do servidor

Express

Criação do servidor e da API

⚙️ Como o sistema funciona?

O usuário cadastra os aparelhos e informa seus dados de utilização. O JavaScript do site envia essas informações para o servidor por meio de uma requisição HTTP.

O servidor recebe os dados, realiza os cálculos e devolve os resultados para a interface, que apresenta as informações da simulação.

O consumo mensal estimado de cada aparelho é calculado com base na potência, nas horas de uso diário e nos dias de utilização no mês.

🔌 API do projeto

O sistema utiliza uma rota para receber os dados dos aparelhos e realizar a simulação.

Rota: POST /api/simular

Essa rota recebe uma lista de aparelhos em formato JSON e retorna os resultados dos cálculos. Caso a lista esteja vazia ou os dados sejam inválidos, o servidor pode retornar uma mensagem de erro.

👩‍💻 Desenvolvedoras

Luiza Crepaldi & Giovanna Ramos

Projeto desenvolvido com foco no aprendizado de desenvolvimento web, integração entre front-end e back-end e conscientização sobre o consumo de energia elétrica.

Fórmula do consumo mensal:

Consumo (kWh) = Potência (W) × Horas por dia × Dias no mês ÷ 1000

Link do deploy: https://giramosv.github.io/medidor-coopera/
