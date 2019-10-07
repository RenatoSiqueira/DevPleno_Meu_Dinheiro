const init = db => {
    const express = require('express')
    const router = express.Router()

    const CalculadoraController = require('../controllers/calculadora')
    const Controller = require('../controllers')

    router
        .get('/', (req, res) => res.render('home'))
        .get('/calculadora', CalculadoraController.calculadora)
        .get('/operacoes', Controller.operacoes(db))
    //.get('/delete/:id', Controller.deleteItem)
    //.get('/edit/:id', Controller.edit)
    //.post('/edit/:id', Controller.editProcess)
    /*
    
    .get('/nova-operacao', (req, res) => res.render('nova-operacao'))
    .post('/nova-operacao', Controller.newOperation)
    */

    return router
}

module.exports = init