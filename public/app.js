
const aparelhos = [];

const form = document.querySelector("#form-aparelho");
const lista = document.querySelector("#lista-aparelhos");
const resultado = document.querySelector("#resultado");
const mensagem = document.querySelector("#mensagem");
const botaoSimular = document.querySelector("#btn-simular");

// Formata valores em reais
function formatarDinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
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
            desenharLista();
            mensagem.textContent = "";
        });

        item.append(texto, botaoRemover);
        lista.appendChild(item);
    });
}

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

    desenharLista();
    form.reset();
    mensagem.textContent = "Aparelho adicionado com sucesso!";
});

// Envia os aparelhos ao servidor
botaoSimular.addEventListener("click", async () => {
    mensagem.textContent = "";

    if (aparelhos.length === 0) {
        mensagem.textContent = "Adicione pelo menos um aparelho.";
        return;
    }

    botaoSimular.disabled = true;
    botaoSimular.textContent = "Calculando...";

    try {
        const resposta = await fetch("/api/simular", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ aparelhos })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent =
                dados.erro || "Não foi possível realizar a simulação.";
            return;
        }

        mostrarResultado(dados);
        mensagem.textContent = "Simulação concluída!";
    } catch (erro) {
        mensagem.textContent =
            "Não foi possível conectar ao servidor. Verifique se ele está ligado.";
    } finally {
        botaoSimular.disabled = false;
        botaoSimular.textContent = "Simular consumo";
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
        paragrafo.append(rotulo, document.createTextNode(String(valor)));
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
}
