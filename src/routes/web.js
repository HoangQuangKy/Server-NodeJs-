import express from 'express';
import homeController from '../controllers/homeController.js'
let router = express.Router();


const intWebRouter = (app) => {
    router.get('/', function (req, res) {
        res.send('Hello world')
    })
    router.post('/register', homeController.register);
    router.post('/login', homeController.login);
    router.get('/logout', homeController.logout)
    router.get('/products', homeController.getProduct)
    router.post('/create-newOrder', homeController.postToCart)
    router.get('/getOrder', homeController.getOrders)
    return app.use('/', router);
}

export default intWebRouter