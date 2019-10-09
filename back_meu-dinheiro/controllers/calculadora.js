const calculoJuros = (p, i, n) => p * Math.pow(1 + i, n)

const evolucao = (p, i, n) => {
    return Array
        .from(new Array(n), (n, i) => i + 1)
        .map(mes => {
            return { mes, juros: calculoJuros(p, i, mes) }
        })
}

const calculadora = (req, res) => {
    const resultado = {
        calculado: false
    }
    if (req.query.valorInicial && req.query.taxa && req.query.tempo) {
        resultado.calculado = true
        resultado.total = calculoJuros(
            parseFloat(req.query.valorInicial),
            parseFloat(req.query.taxa) / 100,
            parseInt(req.query.tempo)
        )
        resultado.evolucao = evolucao(
            parseFloat(req.query.valorInicial),
            parseFloat(req.query.taxa) / 100,
            parseInt(req.query.tempo)
        )
    }

    res.render('calculadora', { resultado })
}

module.exports = {
    calculadora
}