const express = require('express')
const productRouter = require('./routes/products')
const cartsRouter = require('./routes/carts')
const path = require('path')
const { engine } = require('express-handlebars')
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }).then(() => console.log('Conectado a la base de datos'))

    .catch(function(error) {console.error('Error de conexión a la base de datos:', error)});

const PORT = process.env.PORT || 8080;

const app = express()
app.use(express.json())

app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/home', (_req, res) => res.render('home'))
app.get('/realTimeProducts', (_req, res) => res.render('realTimeProducts'))

module.exports = app;



