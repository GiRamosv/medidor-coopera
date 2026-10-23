// coleta os dados do aparelho
const cfg = require("./config");

function consumoMensalKwh(aparelho) {
  return (aparelho.potenciaW * aparelho.horasDia * aparelho.diasMes) / 1000;
}

// custo total da energia
function custoEnergia(kwh) {
  return kwh * cfg.TARIFA_KWH;
}

// custo total da energia com a bandeira
function adicionalBandeira(kwh) {
  const valor = cfg.VALORES_BANDEIRA[cfg.BANDEIRA];
  return (kwh / 100) * valor;
}

// quantidade de paineis necessarios
function paineisNecessarios(kwh) {
  const geracaoPainel =
    (cfg.POTENCIA_PAINEL_W / 1000) * cfg.HSP * 30 * cfg.EFICIENCIA;
  return Math.ceil(kwh / geracaoPainel);
}

// monta a lista de aparelhos cadastrados
function simular(aparelhos) {
  const detalhes = aparelhos.map((aparelho) => {
    const kwhMes = consumoMensalKwh(aparelho);
    const custo = custoEnergia(kwhMes);

    return {
      nome: aparelho.nome,
      kwhMes: kwhMes,
      custo: custo,
      percentual: 0,
    };
  });

  // consumo total de energia dos aparelhos cadastrados
  const consumoTotal = detalhes.reduce((soma, aparelho) => {
    return soma + aparelho.kwhMes;
  }, 0);

  // calcula o percentual de cada aparelho no consumo total
  detalhes.forEach((aparelho) => {
    aparelho.percentual =
      consumoTotal > 0 ? (aparelho.kwhMes / consumoTotal) * 100 : 0;
  });

  //juntar os valores finais
  const valorEnergia = custoEnergia(consumoTotal);
  const adicional = adicionalBandeira(consumoTotal);
  const totalMes = valorEnergia + adicional;

  const maisCaro = detalhes.reduce((maior, atual) => {
    return atual.custo > maior.custo ? atual : maior;
  });

  // retorna o resultado completo
  return {
    consumoKwhMes: consumoTotal,
    custoEnergia: valorEnergia,
    adicionalBandeira: adicional,
    totalMes: totalMes,
    paineisNecessarios: paineisNecessarios(consumoTotal),
    aparelhoMaisCaro: {
      nome: maisCaro.nome,
      custo: maisCaro.custo,
    },
    detalhes: detalhes,
  };
}

module.exports = {
  consumoMensalKwh,
  custoEnergia,
  adicionalBandeira,
  paineisNecessarios,
  simular,
};
