
const aparelhosSalvos = localStorage.getItem("aparelhos");

const aparelhos = aparelhosSalvos
    ? JSON.parse(aparelhosSalvos)
    : [];

const form = document.querySelector("#form-aparelho");
const lista = document.querySelector("#lista-aparelhos");
const resultado = document.querySelector("#resultado");
const mensagem = document.querySelector("#mensagem");
const botaoSimular = document.querySelector("#btn-simular");
const graficoBarras = document.querySelector("#grafico-barras");

// Formata valores em reais
function formatarDinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Salva os aparelhos no navegador
function salvarAparelhos() {
    localStorage.setItem(
        "aparelhos",
        JSON.stringify(aparelhos)
    );
}

// Mostra os aparelhos cadastrados
function desenharLista() {
    lista.replaceChildren();

    aparelhos.forEach((aparelho, indice) => {
        const item = document.createElement("li");
        const texto = document.createElement("span");
        const botaoRemover = document.createElement("button");

        texto.textContent =
            `${aparelho.nome} — ${aparelho.potenciaW} W, ` +
            `${aparelho.horasDia} h/dia, ${aparelho.diasMes} dias`;

        botaoRemover.textContent = "Remover";
        botaoRemover.type = "button";

        botaoRemover.addEventListener("click", () => {
            aparelhos.splice(indice, 1);

            salvarAparelhos();
            desenharLista();

            mensagem.textContent = "";
        });

        item.append(texto, botaoRemover);
        lista.appendChild(item);
    });
}

// Mostra os aparelhos salvos ao abrir a página
desenharLista();

// Adiciona um aparelho ao array
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.querySelector("#nome").value.trim();

    const potenciaW = Number(
        document.querySelector("#potenciaW").value
    );

    const horasDia = Number(
        document.querySelector("#horasDia").value
    );

    const diasMes = Number(
        document.querySelector("#diasMes").value
    );

    if (
        !nome ||
        !Number.isFinite(potenciaW) ||
        potenciaW < 1 ||
        potenciaW > 10000 ||
        !Number.isFinite(horasDia) ||
        horasDia < 0 ||
        horasDia > 24 ||
        !Number.isInteger(diasMes) ||
        diasMes < 1 ||
        diasMes > 31
    ) {
        mensagem.textContent = "Confira os dados do aparelho.";
        return;
    }

    aparelhos.push({
        nome,
        potenciaW,
        horasDia,
        diasMes
    });

    salvarAparelhos();
    desenharLista();

    form.reset();

    mensagem.textContent = "Aparelho adicionado com sucesso!";
});

/* Faz a simulação diretamente no navegador */
botaoSimular.addEventListener("click", () => {
    mensagem.textContent = "";

    if (aparelhos.length === 0) {
        mensagem.textContent = "Adicione pelo menos um aparelho.";
        return;
    }

    try {
        const TARIFA_KWH = 0.68;
        const VALOR_BANDEIRA = 1.885;
        const POTENCIA_PAINEL_W = 400;
        const HSP = 4.25;
        const EFICIENCIA = 0.8;

        // Calcula o consumo e o custo de cada aparelho
        const detalhes = aparelhos.map((aparelho) => {
            const kwhMes =
                (aparelho.potenciaW *
                aparelho.horasDia *
                aparelho.diasMes) / 1000;

            return {
                nome: aparelho.nome,
                kwhMes,
                custo: kwhMes * TARIFA_KWH,
                percentual: 0
            };
        });

        // Soma o consumo mensal de todos os aparelhos
        const consumoTotal = detalhes.reduce(
            (soma, aparelho) => soma + aparelho.kwhMes,
            0
        );

        // Calcula o percentual de consumo de cada aparelho
        detalhes.forEach((aparelho) => {
            aparelho.percentual = consumoTotal > 0
                ? (aparelho.kwhMes / consumoTotal) * 100
                : 0;
        });

        const custoEnergia = consumoTotal * TARIFA_KWH;

        const adicionalBandeira =
            (consumoTotal / 100) * VALOR_BANDEIRA;

        const totalMes = custoEnergia + adicionalBandeira;

        // Calcula a quantidade estimada de painéis solares
        const geracaoPainel =
            (POTENCIA_PAINEL_W / 1000) *
            HSP * 30 * EFICIENCIA;

        const paineisNecessarios = Math.ceil(
            consumoTotal / geracaoPainel
        );

        // Descobre qual aparelho tem o maior custo
        const maisCaro = detalhes.reduce((maior, atual) =>
            atual.custo > maior.custo ? atual : maior
        );

        // Prepara os dados para mostrar na tela
        const arredondar = (valor) =>
            Math.round((valor + Number.EPSILON) * 100) / 100;

        const dados = {
            consumoKwhMes: arredondar(consumoTotal),
            custoEnergia: arredondar(custoEnergia),
            adicionalBandeira: arredondar(adicionalBandeira),
            totalMes: arredondar(totalMes),
            paineisNecessarios,
            aparelhoMaisCaro: {
                nome: maisCaro.nome,
                custo: arredondar(maisCaro.custo)
            },
            detalhes: detalhes.map((aparelho) => ({
                nome: aparelho.nome,
                kwhMes: arredondar(aparelho.kwhMes),
                custo: arredondar(aparelho.custo),
                percentual: arredondar(aparelho.percentual)
            }))
        };

        mostrarResultado(dados);
        mensagem.textContent = "Simulação concluída!";
    } catch (erro) {
        console.error("Erro na simulação:", erro);
        mensagem.textContent =
            "Não foi possível realizar a simulação.";
    }
});

// Exibe os resultados retornados pela API
function mostrarResultado(dados) {
    resultado.replaceChildren();

    const titulo = document.createElement("h2");
    titulo.textContent = "Resultado da simulação";
    resultado.appendChild(titulo);

    const informacoes = [
        ["Consumo mensal", `${dados.consumoKwhMes} kWh`],
        ["Custo da energia", formatarDinheiro(dados.custoEnergia)],
        ["Adicional da bandeira", formatarDinheiro(dados.adicionalBandeira)],
        ["Total estimado da conta", formatarDinheiro(dados.totalMes)],
        ["Painéis solares necessários", dados.paineisNecessarios]
    ];

    informacoes.forEach(([nome, valor]) => {
        const paragrafo = document.createElement("p");
        const rotulo = document.createElement("strong");

        rotulo.textContent = `${nome}: `;

        paragrafo.append(
            rotulo,
            document.createTextNode(String(valor))
        );

        resultado.appendChild(paragrafo);
    });

    const destaque = document.createElement("h3");

    destaque.textContent =
        `Aparelho que mais consome em dinheiro: ` +
        `${dados.aparelhoMaisCaro.nome} — ` +
        formatarDinheiro(dados.aparelhoMaisCaro.custo);

    resultado.appendChild(destaque);

    const tituloTabela = document.createElement("h3");
    tituloTabela.textContent = "Detalhes por aparelho";
    resultado.appendChild(tituloTabela);

    const tabela = document.createElement("table");
    const cabecalho = document.createElement("tr");

    ["Aparelho", "Consumo (kWh)", "Custo", "Percentual"].forEach((texto) => {
        const th = document.createElement("th");
        th.textContent = texto;
        cabecalho.appendChild(th);
    });

    const thead = document.createElement("thead");
    thead.appendChild(cabecalho);
    tabela.appendChild(thead);

    const corpo = document.createElement("tbody");

    dados.detalhes.forEach((aparelho) => {
        const linha = document.createElement("tr");

        [
            aparelho.nome,
            aparelho.kwhMes.toLocaleString("pt-BR"),
            formatarDinheiro(aparelho.custo),
            `${aparelho.percentual.toLocaleString("pt-BR")}%`
        ].forEach((valor) => {
            const celula = document.createElement("td");
            celula.textContent = String(valor);
            linha.appendChild(celula);
        });

        corpo.appendChild(linha);
    });

    tabela.appendChild(corpo);
    resultado.appendChild(tabela);

    // Atualiza o gráfico com os dados da simulação
    desenharGrafico(dados.detalhes);
}

// Cria o gráfico de consumo por aparelho
function desenharGrafico(detalhes) {
    graficoBarras.replaceChildren();

    if (!detalhes || detalhes.length === 0) {
        const texto = document.createElement("p");
        texto.textContent = "Nenhum dado disponível para o gráfico.";
        graficoBarras.appendChild(texto);
        return;
    }

    detalhes.forEach((aparelho) => {
        const item = document.createElement("div");
        const nome = document.createElement("p");
        const trilho = document.createElement("div");
        const barra = document.createElement("div");
        const valor = document.createElement("p");

        nome.textContent = aparelho.nome;

        trilho.className = "grafico-trilho";
        barra.className = "grafico-barra";

        const percentual = Math.max(
            0,
            Math.min(100, Number(aparelho.percentual) || 0)
        );

        barra.style.width = `${percentual}%`;

        valor.textContent =
            `${aparelho.kwhMes.toLocaleString("pt-BR")} kWh ` +
            `(${percentual.toLocaleString("pt-BR")}%)`;

        item.className = "grafico-item";

        item.append(nome, trilho, valor);
        trilho.appendChild(barra);
        graficoBarras.appendChild(item);
    });
}
