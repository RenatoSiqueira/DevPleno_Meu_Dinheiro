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

module.exports = {
    find,
    insert,
    remove,
    update
}
