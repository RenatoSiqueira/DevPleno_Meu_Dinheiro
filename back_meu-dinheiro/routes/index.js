const init = db => {
    const express = require('express')
    const router = express.Router()

    const CalculadoraController = require('../controllers/calculadora')
    const Controller = require('../controllers')

    router
        .get('/', (req, res) => res.render('home'))
        .get('/calculadora', CalculadoraController.calculadora)
        .get('/nova-operacao', (req, res) => res.render('nova-operacao'))
        .post('/nova-operacao', Controller.newOperation(db))
        .get('/operacoes', Controller.operacoes(db))
        .get('/operacoes/delete/:id', Controller.deleteItem(db))
        .get('/operacoes/edit/:id', Controller.edit(db))
        .post('/operacoes/edit/:id', Controller.editProcess(db))
    return router
}

module.exports = init