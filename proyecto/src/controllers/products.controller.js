const Product = require('../models/product.model');

exports.getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query

        let filter = {}
        if (query) {
            try { filter = JSON.parse(query); }
            catch {
                query.split(',').fotEach(pair => {
                    const [k, v] = pair.split(':')
                    if(!k) return;
                    if ( v === 'true') filter[k] = true;
                    else if ( v === 'false') filter[k] = false;
                    else if (!isNaN(Number(v))) filter[k] = Number(v);
                    else filter[k] = v;
                })
            }
        }
        
        let sortObj = {}
        if (sort) {
            const [field, direction = 'asc'] = sort.split(':')
            sortObj[field] = direction.toLowerCase() === 'desc' ? -1 : 1;
        }
        
    }
}