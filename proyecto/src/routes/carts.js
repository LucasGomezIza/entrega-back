const { Router } = require('express');
const ctrl = require('../controllers/carts.controller');
const router = Router();

router.post('/', ctrl.createCart);
router.get('/:cid', ctrl.getCart);
router.put('/:cid', ctrl.replaceCart);
router.delete('/:cid', ctrl.emptyCart);
router.post('/:cid/product/:pid', ctrl.addProduct);
router.put('/:cid/product/:pid', ctrl.updateProductQty);
router.delete('/:cid/product/:pid', ctrl.removeProduct);

module.exports = router;
