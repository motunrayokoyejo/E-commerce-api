const mongoose = require('mongoose')
const { stringify } = require('querystring')

const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const categorySchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    name: {
        type: String
        // required: [true, "Please include the category name"]
    }
});

let productSchema = new mongoose.Schema({
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    categoryIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    }],
    name: {
        type: String, required: [true, "Please include the product name"]
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity can not be less then 1.'],
        default: 0
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})


const User = mongoose.model('user', userSchema)
const Products = mongoose.model('products', productSchema)
const Categories = mongoose.model('categories', categorySchema)

const getProducts = async () => {
    const products = await Products.find();
    let creator = Array.from(products).map( async product => {
        await User.findById(product.creator)
    })
    products.creator = creator
    return products;
};

const getProductById = async id => {
    const product = await Products.findById(id);
    let creator = await User.findById(product.creator)
    product.creator = creator
    return product
};
 
const createNewProduct = async payload => {
    const newProduct = await Products.create(payload);
    console.log(payload)
    return newProduct
};

const removeProduct = async id => {
    const product = await Products.findByIdAndRemove(id);
    return product
}

const editProduct = async (id, payload) => {
    const product = await Products.findByIdAndUpdate(id, payload);
    return product
}

const getCategories = async () => {
    const categories = await Categories.find();
    if (categories.length < 1) {
        return []
    }
    let creatorData = []
    Array.from(categories).forEach( async category =>{
        let creator = await User.findById(category.creator)
        creatorData.push(creator)
        let productIds = categories.products
        category.products = []
        Array.from(productIds).forEach(async productId => {
            let product = await Products.findById(productId)
            category.products.push(product)
        })
    })
    categories.creator = creatorData
    return categories;
};

const getCategoryById = async id => {
    const category = await Categories.findById(id);
    let creator = await User.findById(category.creator)
    category.creator = creator
    let productIds = category.products
    let products = []
    try {
        Array.from(productIds).forEach(async productId => {
            let product = await Products.findById(productId)
            products.push(product)
        })
        category.products = products
        return category
    } catch (error) {
        return  category
    }
};
 
const createNewCategory = async payload => {
    const newCategory = await Categories.create(payload);
    if (payload.products) {
        payload.products.forEach(async product => {
            let pdt = await product.findOne({name: product})
            newCategory.productIds.push(pdt._id)
        })
    }
    newCategory.save()
    console.log(payload)
    return newCategory
};

const removeCategory = async id => {
    const product = await Categories.findByIdAndRemove(id);
    return product
}

const editCategory = async (id, payload) => {
    payload.productIds = payload.products
    const product = await Categories.findByIdAndUpdate(id, payload);
    return product
}

module.exports = {
    User, Categories, Products, createNewProduct, 
    editProduct, getProducts, getProductById,
    getCategories, getCategoryById, editCategory, 
    createNewCategory, removeCategory
}