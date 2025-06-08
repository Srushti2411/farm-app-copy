import Product from '../models/product.model.js';
import mongoose from 'mongoose';

// Get all products with populated 'farmer' field
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('farmer', 'name isCertified certificate');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products: ", error.message);
    res.status(500).json({ success: false, message: "Error fetching products!" });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  const { name, price, unit, image, categories, farmer } = req.body;

  // Check for missing fields
  if (!name || !price || !unit || !image || !categories || !farmer) {
    console.log("Missing fields:", { name, price, unit, image, categories, farmer });
    return res.status(400).json({ success: false, message: "Please provide all the required fields!" });
  }

  const newProduct = new Product(req.body);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in saving data: ", error.message);
    res.status(500).json({ success: false, message: "Server error while saving the product!" });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Product not found by the id you provided!"
    });
  }

  // Validate the fields before updating
  const { name, price, unit, image, categories } = product;
  if (!name || !price || !unit || !image || !categories ) {
    return res.status(400).json({ success: false, message: "Please provide all the required fields!" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product: ", error.message);
    res.status(500).json({ success: false, message: "Failed to update product!" });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Product not found by the id you provided!"
    });
  }

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product: ", error.message);
    res.status(500).json({ success: false, message: "Server error while deleting the product!" });
  }
};
