const fs = require('fs').promises
const path = require('path')

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath)
    }
    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8')
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }
    async getProductById(id) {
        const products = await this.getProducts()
        const product = products.find(p => p.id === id)
        if (!product) {
            throw new Error('Producto no encontrado')
        }
        return product
    }
    async addProduct(productData) {
        const products = await this.getProducts()
        const newProduct = {
            id: Date.now().toString(),
            ...productData
        }
        products.push(newProduct)
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
        return newProduct
    }
    async updateProduct(id, updatedData) {
        const products = await this.getProducts()
        const index = products.findIndex(p => p.id === id)
        if (index === -1) {
            throw new Error('No se pudo encontrar el producto seleccionado')
        }
        products[index] = { ...products[index], ...updatedData }
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
        return products[index]
    }
    async deleteProduct(id) {
        const products = await this.getProducts()
        const index = products.findIndex(p => p.id === id)
        if (index === -1) {
            throw new Error('No se puede eliminar el producto porque no existe')
        }
        products.splice(index, 1)
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
        return { message: 'Producto eliminado' }
    }
}

module.exports = ProductManager