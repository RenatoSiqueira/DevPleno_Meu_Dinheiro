require('dotenv').config()
const MongoClient = require('mongodb').MongoClient

const port = 3000
const mongoUri = process.env.MONGOSERVER || 'mongodb://localhost:27017/meu-dinheiro'

const app = require('./app')

MongoClient.connect(mongoUri, ({ useNewUrlParser: true }), (err, db) => {
    if (err) throw err
    app(db).listen(port, () => console.log('Server running...'))
})