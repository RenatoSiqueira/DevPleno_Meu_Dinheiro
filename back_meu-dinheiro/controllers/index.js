

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

const deleteItem = db => async (req, res) => {
    await remove(db, 'operacoes', req.params.id)
    res.redirect('/operacoes')
}

const edit = db => async (req, res) => {
    const conditions = {
        _id: new ObjectID(req.params.id)
    }
    const operacoes = await find(db, 'operacoes', conditions)
    if (operacoes.length === 0)
        res.redirect('/operacoes')
    else
        res.render('edit-operacao', { operacao: operacoes[0] })
}

const editProcess = db => async (req, res) => {
    const conditions = {
        _id: new ObjectID(req.params.id)
    }
    const operacoes = await find(db, 'operacoes', conditions)
    if (operacoes.length === 0)
        res.redirect('/operacoes')
    else {
        const values = {
            valor: parseInt(req.body.valor),
            descricao: req.body.descricao
        }
        await update(db, 'operacoes', req.params.id, values)
        res.redirect('/operacoes')
    }
}

const operacoes = db => async (req, res) => {
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

const operacoesApi = db => async (req, res) => {
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
    res.send(newOperacoes)
}

const newOperation = db => async (req, res) => {
    const operacao = {
        descricao: req.body.descricao,
        valor: parseFloat(req.body.valor)
    }
    await insert(db, 'operacoes', operacao)
    res.redirect('/operacoes')
}

module.exports = {
    deleteItem,
    edit,
    editProcess,
    operacoes,
    newOperation,
    operacoesApi
}