import express from "express"
import { createProduct, deleteProduct, getProduct,  updateProduct } from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/",verifyToken,getProduct)

router.post("/",verifyToken,createProduct)

router.put("/:id",verifyToken, updateProduct);

router.delete("/:id",verifyToken,deleteProduct);
 
export default router;