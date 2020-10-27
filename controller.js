const { type } = require('os');
const jwt = require('jsonwebtoken')
const db = require('./src/config/models')
require('dotenv').config()

const {SECRET_KEY} = process.env    
exports.createProduct = async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, user) => {
        if (err || !user.user.isAdmin) {
            return res.status(403).json({
                error: 'Unauthorized'
            })
        } else {
            try {
                let {category, name, price} = req.body
                let categoryId = await db.Categories.findOne({name: category})._id
                let payload = {
                    creator: user.user._id,
                    name, price,
                    image: req.file.path
                }
                let product = await db.createNewProduct({
                    ...payload
                });
                res.status(200).json({
                    status: true, data: product
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    error, status: false
                })
            }
        } 
    })
}

exports.editProduct = async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, user) => {
        if (err || !user.user.isAdmin) {
            return res.status(403).json({
                error: 'Unauthorized'
            })
        } else {
            try {
                let formerProduct = await db.getProductById(req.params.id)
                let payload = {
                    creator: user.user._id,
                    name: req.body.name || formerProduct.name,
                    price: req.body.price || formerProduct.price,
                }
                payload.image =  req.file ? req.file.path: formerProduct.image
                let product = await db.editProduct(req.params.id, {
                    ...payload
                });
                console.log(product)
                res.status(200).json({
                    status: true, data: product
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    error, status: false 
                })
            }
        }
    })
 }

exports.getProducts = async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Unauthorized'
            })
        } else {
            try {
                let products = await db.getProducts();
                res.status(200).json({
                    status: true, data: products
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    error, status: false
                })
            } 
        }
    })
 }

exports.getProductById = async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Unauthorized'
            })
        } else {
            try {
                let id = req.params.id
                let product = await db.getProductById(id);
                res.status(200).json({
                    status: true, data: product
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    error, status: false
                })
            }   
        }
    })
 }

exports.removeProduct = async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, user) => {
        if (err || !user.user.isAdmin) {
            res.status(403).json({
                error: 'Unauthorized'
            })
        } else {
            try {
                let id = req.params.id
                let product = await db.removeProduct(id);
                res.status(200).json({
                    status: true, data: product
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    error, status: false
                })
            }   
        }
    })
 }

 exports.createCategory = async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, user) => {
        console.log(user)
        if (err || !user.user.isAdmin) {
            return res.status(403).json({
                error: 'Unauthorized'
            })
        } else {
            try {
                console.log(req.body)
                let payload = {
                    creator: user.user._id,
                    name: req.body.name
                }
                let category = await db.createNewCategory({
                    ...payload
                });
                res.status(200).json({
                    status: true, data: category
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    error, status: false
                })
            }
        } 
    })
}

exports.editCategory = async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, user) => {
        if (err || !user.user.isAdmin) {
            return res.status(403).json({
                error: 'Unauthorized'
            })
        } else {
            try {
                let formerCategory = await db.getCategoryById(req.params.id)
                let payload = {
                    creator: user.user._id,
                    name: req.body.name || formerCategory.name,
                    price: req.body.price || formerCategory.price,
                }
                payload.image =  req.file ? req.file.path: formerCategory.image
                let category = await db.editCategory(req.params.id, {
                    ...payload
                });
                console.log(category)
                res.status(200).json({
                    status: true, data: category
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    error, status: false 
                })
            }
        }
    })
 }

exports.getCategories = async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Unauthorized'
            })
        } else {
            try {
                let categories = await db.getCategories();
                res.status(200).json({
                    status: true, data: categories
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    error, status: false
                })
            } 
        }
    })
 }

exports.getCategoryById = async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(403).json({
                error: 'Unauthorized'
            })
        } else {
            try {
                let id = req.params.id
                let category = await db.getCategoryById(id);
                res.status(200).json({
                    status: true, data: category
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    error, status: false
                })
            }   
        }
    })
 }

exports.removeCategory = async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, user) => {
        if (err || !user.user.isAdmin) {
            res.status(403).json({
                error: 'Unauthorized'
            })
        } else {
            try {
                let id = req.params.id
                let category = await db.removeCategory(id);
                res.status(200).json({
                    status: true, data: category
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    error, status: false
                })
            }   
        }
    })
 }

