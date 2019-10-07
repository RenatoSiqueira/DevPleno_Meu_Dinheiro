const calculoJuros = (p, i, n) => p * Math.pow(1 + i, n)

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