// src/store/product.js
import { create } from "zustand";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),

    createProduct: async (newProduct) => {
        // Ensure all required fields are filled
        if (!newProduct.name || !newProduct.price || !newProduct.unit || !newProduct.image || !newProduct.categories) {
            return { success: false, message: "Please provide all the required fields!" };
        }

        try {
            const res = await fetch("http://localhost:5173/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });

            // Log the response for better debugging
            const responseBody = await res.json();
            console.log("Response from server:", responseBody);

            if (!res.ok) {
                console.error('Error Response:', responseBody);
                return { success: false, message: `Failed to create product. ${responseBody.message || 'Unknown error'}` };
            }

            set((state) => ({ products: [...state.products, responseBody.data] }));
            return { success: true, message: "Product Created successfully!" };

        } catch (error) {
            console.error('Fetch Error:', error);
            return { success: false, message: "Network error occurred while creating the product." };
        }
    },

    fetchProducts: async () => {
        const res = await fetch("http://localhost:5173/api/products");
        const data = await res.json();
        set({ products: data.data });
    },

    deleteProducts: async (pid) => {
        const res = await fetch(`http://localhost:5173/api/products/${pid}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
        return { success: true, message: data.message };
    },

    updateProducts: async (pid, updatedProduct) => {
        const res = await fetch(`http://localhost:5173/api/products/${pid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: "Error while updating the product details" };

        set((state) => ({
            products: state.products.map((product) =>
                product._id === pid ? data.data : product
            ),
        }));
        return { success: true, message: "Successfully Updated!" };
    },
}));
