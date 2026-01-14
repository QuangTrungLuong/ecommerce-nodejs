require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
const { countConnect } = require('./helpers/check.connect')
const app = express()


// init middlewares
app.use(morgan("dev")) // khi nào dùng dev thì bật mode này
app.use(helmet()) // giup bao mat ung dung web bang cach tu dong them cac HTTP security header
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init db 
require('./dbs/init.mongodb')
//const { checkOverload } = require('./helpers/check.connect')
//checkOverload()


//init routes
app.use('/', require('./routes'))
//handling error
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const errorCode = error.status || 500
    return res.status(errorCode).json({
        status: 'error',
        code: errorCode,
        message: error.message || 'Internal Server Error'
    })
})
module.exports = app