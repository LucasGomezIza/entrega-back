const express = require('express')
const CartManager = require('../managers/cartManager')

const router = express.Router()
const cartManager = new CartManager('./data/carts.json')

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart()
    res.status(201).json(newCart)
})

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid)
    if(!cart) return res.status(404).json({error: 'Carrito o producto no encontrado'})
    res.json(updateCart)
})

module.exports = router;