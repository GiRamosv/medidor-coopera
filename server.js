
const express = require('express');
const { simular } = require('./calculos');

const app = express();
const PORT = 3000;

// Permite receber dados em formato JSON
app.use(express.json());

// Abre os arquivos do front-end que estão na pasta public
app.use(express.static('public'));

// Rota para simular o consumo de energia
app.post('/api/simular', (req, res) => {
    const aparelhos = req.body?.aparelhos;

    // 1. Verifica se a lista existe e não está vazia
    if (!Array.isArray(aparelhos) || aparelhos.length === 0) {
        return res.status(400).json({
            erro: 'A lista de aparelhos não pode estar vazia.'
        });
    }

    // 2. Valida cada aparelho
    for (let i = 0; i < aparelhos.length; i++) {
        const aparelho = aparelhos[i];
        const numero = i + 1;

        if (!aparelho || typeof aparelho !== 'object' || Array.isArray(aparelho)) {
            return res.status(400).json({
                erro: `Aparelho ${numero} inválido.`
            });
        }

        // Validação do nome
        if (
            typeof aparelho.nome !== 'string' ||
            aparelho.nome.trim() === ''
        ) {
            return res.status(400).json({
                erro: `nome deve conter texto (aparelho ${numero}).`
            });
        }

        // Validação da potência
        if (
            typeof aparelho.potenciaW !== 'number' ||
            !Number.isFinite(aparelho.potenciaW) ||
            aparelho.potenciaW < 1 ||
            aparelho.potenciaW > 10000
        ) {
            return res.status(400).json({
                erro: `potenciaW deve estar entre 1 e 10000 (aparelho ${numero}).`
            });
        }

        // Validação das horas por dia
        if (
            typeof aparelho.horasDia !== 'number' ||
            !Number.isFinite(aparelho.horasDia) ||
            aparelho.horasDia < 0 ||
            aparelho.horasDia > 24
        ) {
            return res.status(400).json({
                erro: `horasDia deve estar entre 0 e 24 (aparelho ${numero}).`
            });
        }

        // Validação dos dias no mês
        if (
            typeof aparelho.diasMes !== 'number' ||
            !Number.isInteger(aparelho.diasMes) ||
            aparelho.diasMes < 1 ||
            aparelho.diasMes > 31
        ) {
            return res.status(400).json({
                erro: `diasMes deve ser um inteiro entre 1 e 31 (aparelho ${numero}).`
            });
        }
    }

    // 3. Calcula os resultados usando calculos.js
    try {
        const resultado = simular(aparelhos);
        return res.status(200).json(resultado);
    } catch (erro) {
        console.error('Erro ao simular:', erro);

        return res.status(500).json({
            erro: 'Não foi possível calcular o consumo.'
        });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Medidor Coopera rodando em http://localhost:${PORT}`);
});
