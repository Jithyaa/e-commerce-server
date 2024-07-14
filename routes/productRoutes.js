import express from 'express'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/productController.js'

const router = express.Router()

router.get('/', getProducts);   
router.get("/hi",(req,res)=>{
    res.send("API is working")
})
router.post('/createProduct', createProduct);
router.post('/deleteVariant', deleteProduct);
router.post('/getProduct', getProduct);
router.put('/:id', updateProduct);

export default router


