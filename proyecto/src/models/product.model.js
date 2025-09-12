const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ProductSchema = new Schema({
    title: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    code: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, index: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    thumbnails: { type: [String], default: [] }
    }, { timestamps: true });

ProductSchema.plugin(mongoosePaginate)
module.exports = model('Product', ProductSchema)

