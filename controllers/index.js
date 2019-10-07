const { find, insert, remove, update } = require('../utils/functions')

const subtotal = operacoes => {
    let sub = 0
    return operacoes.map(operacao => {
        sub += operacao.valor
        let newOperacao = {
            _id: operacao._id,
            valor: operacao.valor,
            descricao: operacao.descricao,
            sub: sub
        }
        return newOperacao
    })
}

const evolucao = (p, i, n) => {
    Array
        .from(new Array(n), (n, i) => i + 1)
        .map(mes => {
            return { mes, juros: calculoJuros(p, i, mes) }
        })
}

const deleteItem = async (req, res) => {
    await remove(app.db, 'operacoes', req.params.id)
    res.redirect('/operacoes')
}

const edit = async (req, res) => {
    const conditions = {
        _id: new ObjectID(req.params.id)
    }
    const operacoes = await find(app.db, 'operacoes', conditions)
    if (operacoes.length === 0)
        res.redirect('/operacoes')
    else
        res.render('edit-operacao', { operacao: operacoes[0] })
}

const editProcess = async (req, res) => {
    const conditions = {
        _id: new ObjectID(req.params.id)
    }
    const operacoes = await find(app.db, 'operacoes', conditions)
    if (operacoes.length === 0)
        res.redirect('/operacoes')
    else
        await update(app.db, 'operacoes', req.params.id, req.body)
    res.redirect('/operacoes')
}

const operacoes = (db) => async (req, res) => {
    let conditions = {}
    if (req.query.tipo && req.query.tipo === 'entradas') {
        conditions = {
            valor: { $gte: 0 }
        }
    } else if (req.query.tipo && req.query.tipo === 'saidas') {
        conditions = {
            valor: { $lt: 0 }
        }
    }

    const operacoes = await find(db, 'operacoes', conditions)
    const newOperacoes = subtotal(operacoes)
    res.render('operacoes', { operacoes: newOperacoes })

}

const newOperation = async (req, res) => {
    const operacao = {
        descricao: req.body.descricao,
        valor: parseFloat(req.body.valor)
    }
    await insert(app.db, 'operacoes', operacao)
    res.redirect('/operacoes')
}

module.exports = {
    deleteItem,
    edit,
    editProcess,
    operacoes,
    newOperation
}