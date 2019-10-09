const init = db => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const path = require('path')
    const app = express()

    const Router = require('./routes')

    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(express.static('public'))

    app.use(Router(db))

    return app
}

module.exports = init