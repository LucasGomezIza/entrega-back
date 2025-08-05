const express = require('requires')
const ProductManager = require('../managers/productManager')
const router = express.router()
const productManager = new ProductManager('./data/products.json')

router.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    res.json(products)
})

router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid)
    if(!product) return res.status(404).json({error: `Producto no encontrado`})
    res.json(product)
})

router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body)
    res.status(201).json(newProduct)
})

router.put('/:pid', async (req, res) => { 
    try{
        const updateProduct = await productManager.updateProduct(req.params.pid, req.body)
        res.json(updateProduct)
    } catch (error) {
        res.status(404).json({error: 'No se pudo encontrar el producto seleccionado'})
    }
})

router.delete('/:pid', async (req, res) => {
    const succes = await productManager.deleteProduct(req.params.pid)
    if(!succes) return res.status(404).json({error: `Producto no encontrado`})
    res.json({message: `Producto eliminado`})
})