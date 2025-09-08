const express = require('express')
const ProductManager = require('../managers/productManager')
const router = express.Router()
const productManager = new ProductManager('./data/products.json')

router.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    res.json(products)
})

router.get('/:pid', async (req, res) => { 
    try{
        const product = await productManager.getProductById(req.params.pid)
        res.json(product)
    } catch (error) {
        res.status(404).json({error:'No se encontro el producto'})
    }
})

router.post('/', async (req, res) => {
    const { category, title, description, status, price, thumbnails, code, stock, id } = req.body
    if (id) {
        return res.status(400).json({ error: 'No es posible asignar el id manualmente' })
    }
    if (
        !title ||
        !description ||
        !code ||
        price === undefined ||
        stock === undefined ||
        status === undefined ||
        !category ||
        !Array.isArray(thumbnails) ||
        !thumbnails.every(t => typeof t === 'string')
    ) {
        return res.status(400).json({ error: 'Faltan campos requeridos'})
    }
    const newProduct = await productManager.addProduct(req.body)
    
    const io = req.app.get('io')
    io?.emit('products:update', { type: 'created', product: newProduct })
    
    res.status(201).json(newProduct)
})

router.put('/:pid', async (req, res) => { 
    if ('id' in req.body) {
        return res.status(400).json({ error: 'El id del producto no se puede modificar' })
    }
    try{
        const updateProduct = await productManager.updateProduct(req.params.pid, req.body)

        const io = req.app.get('io') //Emite actualización en tiempo real
        io?.emit('products:update', { type: 'updated', product: updateProduct })

        res.json(updateProduct)
    } catch (error) {
        res.status(404).json({error: 'No se pudo encontrar el producto seleccionado'})
    }
})

router.delete('/:pid', async (req, res) => { 
    try {
        const succes = await productManager.deleteProduct(req.params.pid)

        const io = req.app.get('io')
        io?.emit('products:update', { type: 'deleted', productId: Number(req.params.pid) })
        
        res.status(200).json(succes
        )
    } catch (error) {
        res.status(404).json({error: 'No se puede eliminar el producto porque no existe'})
    }
})

module.exports = router