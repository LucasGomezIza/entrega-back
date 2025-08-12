const fs= require('fs').promises
const path = require('path')


class CartManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath)
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8')
            return JSON.parse(data)
        } catch (error) {
            return[]
        }

    }

    async saveCarts(carts) {
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2))
    }

    async createCart() {
        const carts = await this.getCarts()
        const newCart = {
            id: Date.now().toString(),
            products: []
        }
        carts.push(newCart)
        await this.saveCarts(carts)
        return newCart
    }

    async getCartById(id) {
        const carts = await this.getCarts()
        return carts.find(cart => cart.id === id)
    }

    async updateCart(id, updatedCart) {
        const carts = await this.getCarts()
        const index = carts.findIndex(cart => cart.id === id)
        if (index === -1) return null
        carts[index] = updatedCart
        await this.saveCarts(carts)
        return updatedCart
    }
}

module.exports = CartManager