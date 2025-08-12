const express = require('express')
const productRouter = require('/routes/products')
const cartsRouter = require('/routes/carts')

const app = express()
app.use(express.json())

app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)

app.listen(8080, () => {
    console.log('Servidor escuchando el en el puerto 8080')
})

