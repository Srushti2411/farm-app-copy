import Product from "../models/product.model.js";
import mongoose from "mongoose";

//getProduct
export const getProduct = async (req, res) => {
    try {
        const product = await Product.find({});
        res.status(200).json({ success: true, data: product });

    } catch (error) {
        console.error("Error: ", error.message);
        res.status(404).json({ success: false, message: "No products found!" });
    }
}

//createProducts
export const createProduct = async (req, res) => {
    const product = req.body;

    if (!product.name || !product.price || !product.unit || !product.image) {
        return res.status(400).json({ success: false, message: "Please provide all the fields!" });
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct })
    } catch (error) {
        console.log(`Error in saving data: ${error.message} `);
        res.status(500).json({ success: false, message: "Server error!" });
    }
}

//updateProduct
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({
            success: false,
            message: "Product not found by the id you provided!"
        })
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).json({ success: false, message: "Your product details is not updated!" });
    }
}

//deleteProduct
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({
            success: false,
            message: "Product not found by the id you provided!"
        })
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "product deleted Successfully" });
    } catch (error) {
        console.error(`Error in deleting product: ${error.message}`);
        res.status(500).json({ success: false, message: "server error" });
    }
}


