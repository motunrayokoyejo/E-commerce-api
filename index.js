const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const productRoute = require('./src/productRoutes')
const categoryRoute = require('./src/categoryRoutes')
const bcrypt = require('bcryptjs')
require("./src/config/mongoose.js")(app);
const authRoute = require('./src/auth/auth')

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json())
app.use('/files', express.static("files"));
app.use('/product', productRoute)
app.use('/category', categoryRoute)
app.use('/auth', authRoute)

app.get('/',(req, res) => {
    res.json({
        project: 'My law internship'
    });
});

app.get('/users',  async (req, res) => {
    try {
        let users = await User.find()
        res.status(200).json({
            status: true, users
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})

const port = process.env.PORT || 4000;

app.listen(port, () => {
   console.log('Application running successfully') 
})