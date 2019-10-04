const calculoJuros = (p, i, n) => p * Math.pow(1 + i, n)

const ObjectID = require('mongodb').ObjectID

const find = (db, collectionName, conditions) => {
    const collection = db.collection(collectionName)
    const cursor = collection.find(conditions)
    const documents = []

    return new Promise((resolve, reject) => {
        cursor.forEach(
            (doc) => documents.push(doc),
            () => resolve(documents)
        )
    })
}

const insert = (db, collectionName, document) => {
    const collection = db.collection(collectionName)
    return new Promise((resolve, reject) => {
        collection.insert(document, (err, doc) => {
            if (err) {
                reject(err)
            } else {
                resolve(doc)
            }
        })
    })
}

const remove = (db, collectionName, id) => {
    const operacoes = db.collection(collectionName)
    new Promise((resolve, reject) => {
        operacoes.deleteOne({ _id: new ObjectID(id) }, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

const update = (db, collectionName, id, values) => {
    const collection = db.collection(collectionName)
    return new Promise((resolve, reject) => {
        collection.updateOne(
            { _id: new ObjectID(id) },
            { $set: values },
            (err, result) => {
                if (err)
                    reject(err)
                else
                    resolve(result)
            })
    })
}

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
    console.log(db)

    //    const operacoes = await find(db, 'operacoes', conditions)
    //    const newOperacoes = subtotal(operacoes)
    //res.render('operacoes', { operacoes: newOperacoes })
    res.render('operacoes')
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
    calculadora,
    deleteItem,
    edit,
    editProcess,
    operacoes,
    newOperation
}