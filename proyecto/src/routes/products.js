const { Router } = require('express');
const ctrl = require('../controllers/products.controller');
const router = Router();

router.get('/', ctrl.getProducts);
router.get('/:pid', ctrl.getProductById);
router.post('/', ctrl.createProduct);
router.put('/:pid', ctrl.updateProduct);
router.delete('/:pid', ctrl.deleteProduct);

module.exports = router;
