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
        
        const options = {
            limit: Math.max(parseInt(limit), 1),
            page: Math.max(parseInt(page), 1),
            sort: Object.keys(sortObj).length ? sortObj : {createdAt: -1},
            lean: true
        }

        const result = await Product.paginate(filter, options)

        const base = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
        const link = (p) => `${base}?page=${p}&limit=${options.limit}` + (sort ? `&sort=${encodeURIComponent(sort)}` : '') +
        (query ? `&query=${encondeURIComponent(query)}` : '');

        res.json({
            status: 'success',
            payload: result.docs,
            totalDocs: result.totalDocs,
            limit: result.limit,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            prevLink: result.hasPrevPage ? link(result.prevPage) : null,
            nextLink: result.hasNextPage ? link(result.nextPage) : null,
        });
    } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error interno' });
    }
}

exports.getProductById = async (req, res) => { 
    try { 
        const p = await Product.findById(req.params.pid).lean();
        if (!p) return res.status(404).json({ status: 'error', message: 'No se pudo encontrar el producto' });
        res.json({ status: 'success', payload: p });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const created = await Product.create(req.body);
        res.status(201).json({ status: 'success', payload: created });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.pid, req.body, { new: true }
        ).lean();
        if (!updated) return res.status(404).json({ status: 'error', message: 'No se pudo encontrar el producto' });
        res.json({ status: 'success', payload: updated });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.pid).lean();
        if (!deleted) return res.status(404).json({ status: 'error', message: 'No se pudo encontrar el producto' });
        res.json({ status: 'success', payload: deleted });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
}

