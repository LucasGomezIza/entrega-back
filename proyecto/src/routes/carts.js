const express = require('express')
const CartManager = require('../managers/cartManager')
const router = express.Router()
const cartManager = new CartManager('..proyecto/data/carts.json')

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart()
    res.status(201).json(newCart)
})

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid)
    if(!cart) return res.status(404).json({error: 'Carrito o producto no encontrado'})
    res.json(cart)
})

router.post('/:cid/products/:pid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid)
    if(!cart) return res.status(404).json({error: 'No fue posible encontrar el carrito'})
    const productIndex = cart.products.findIndex(p => p.product === req.params.pid)
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1})
    }
    await cartManager.updateCart(req.params.cid, cart)
    res.json(cart)
})
module.exports = router