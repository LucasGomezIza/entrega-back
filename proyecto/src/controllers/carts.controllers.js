const Cart = require('../models/Cart');
const Product = require('../models/product.model');

exports.getCarts = async (req, res) => {
    const carts = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', payload: carts });
};

exports.getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).json({ status: 'error', message: 'No se pudo encontrar el carrito' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

exports.replaceCart = async (req, res) => {
    try { 
        const items = Array.isArray(req.body) ? req.body : req.body.products;
        if (Array.isArray) return res.status(400).json({ status: 'error', message: 'El formato del carrito es inválido' });

        for (const it of items) {
            if (!it.product) return res.status(400).json({ status: 'error', message: 'Falta prodcuto' });
            const exists = await Product.exists({_id: it.product});
            if (!exists) return res.status(400).json({ status: 'error', message: `El producto ${it.product} no existe` });
        }

        const cart = await Cart.findByIdAndUpdate(
            req.params.cid,
            { products: items.map(it => ({ product: it.product, quantity: Math.max(1, Number(it.quantity || 1)) })) },
            { new: true }
        ).populate('products.product').lean();

        if (!cart) return res.status(404).json({ status: 'error', message: 'No se pudo encontrar el carrito' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

exports.emptyCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.cid, {products: [] }, { new: true }).lean();
        if (!cart) return res.status(404).json({ status: 'error', message: 'No se pudo encontrar el carrito' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

exports.addProduct = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const { quantity = 1 } = req.body;

        const prod = await Product.findById(pid);
        if (!prod) return res.status(404).json({ status: 'error', message: 'No se pudo encontrar el producto' });

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'No se pudo encontrar el carrito' });

        const idx = cart.products.findIndex(p => p.product.toString() === pid);
        if (idx >= 0) cart.products[idx].quantity += Math.max(1, Number(quantity));
        else cart.products.push({ product: pid, quantity: Math.max(1, Number(quantity)) });

        await cart.save();
        await cart.populate('products.product');

        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

exports.updateProductQuantity = async (req, res) => {
    try { 
        const { pid, cid } = req.params;
        const { quantity } = req.body;
        if (isNaN(Number(quantity)) || Number(quantity) < 1) 
            return res.status(400).json({ status: 'error', message: 'La cantidad es inválida' });

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'No se pudo encontrar el carrito' });

        const item = cart.products.find(p => p.product.toString() === pid);
        if (!item) return res.status(404).json({ status: 'error', message: 'El producto no existe en el carrito' });

        item.quantity = Number(quantity);
        await cart.save();
        await cart.populate('products.product');

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'No se pudo encontrar el carrito' });

        const before = cart.products.length;
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        if (cart.products.length === before) return res.status(404).json({ status: 'error', message: 'El producto no existe en el carrito' });

        await cart.save();
        await cart.populate('products.product');

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

