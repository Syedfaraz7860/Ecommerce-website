import express from 'express';
import upload from "../config/multer.js";

import {
 createProduct,
 getProducts,
 updateProduct,
 deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.post('/add', upload.single("image"), createProduct);

// GET ALL PRODUCTS
router.get('/', getProducts);

// UPDATE
router.put('/update/:id', updateProduct);

// DELETE
router.delete('/delete/:id', deleteProduct);

export default router;