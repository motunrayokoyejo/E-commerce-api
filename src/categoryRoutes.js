const express = require('express');
const { token } = require('morgan');
const routeController = require('../controller');
router = express.Router()

function verifyToken(req, res, next) {
    const tokenHeader = req.headers['authorization']
    if (typeof tokenHeader !== 'undefined') {
        const token = tokenHeader.split(' ')[1]
        req.token = token
        next()
    } else {
        res.status(403).json({
            error: 'Unauthorized'
        })
    }
}
 
router.post('/', verifyToken, routeController.createCategory);
router.get('/', verifyToken, routeController.getCategories)
router.get('/:id', verifyToken, routeController.getCategoryById);
router.delete('/:id', verifyToken, routeController.removeCategory);
router.put('/:id', verifyToken, routeController.editCategory);

module.exports = router