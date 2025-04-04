import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/cart"; // Replace with your actual API URL

export const useCartStore = create((set) => ({
  cart: [],
  error: null,
  isLoading: false,

  // Add item to the cart
  addToCart: async (userId, productId, quantity, price, image) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/add`, {
        userId,
        productId,
        quantity,
        price,
        image,
      });

      if (response.data.success) {
        set((state) => ({
          cart: [...state.cart, response.data.product],
          isLoading: false,
        }));
        return { success: true, message: "Product added to cart successfully!" };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add to cart";
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Remove item from cart (Fixed method to DELETE)
  removeFromCart: async (userId, productId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.delete(`${API_URL}/remove`, {
        data: { userId, productId } // ✅ 'data' is required for DELETE requests
      });

      if (response.data.success) {
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
          isLoading: false,
        }));
        return { success: true, message: "Product removed from cart successfully!" };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to remove from cart";
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Update quantity of an item in cart
  updateQuantity: async (userId, productId, quantity) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/update`, {
        userId,
        productId,
        quantity,
      });

      if (response.data.success) {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
          isLoading: false,
        }));
        return { success: true, message: "Quantity updated successfully!" };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update quantity";
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Get current cart
  getCart: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}`, { params: { userId } });

      if (response.data.success) {
        set({ cart: response.data.cart, isLoading: false });
        return { success: true, message: "Cart fetched successfully!" };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch cart";
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Clear the entire cart (Fixed method to DELETE)
  clearCart: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.delete(`${API_URL}/clear`, {
        data: { userId } // ✅ 'data' is required for DELETE requests
      });

      if (response.data.success) {
        set({ cart: [], isLoading: false });
        return { success: true, message: "Cart cleared successfully!" };
      } else {
        set({ error: response.data.message, isLoading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to clear cart";
      set({ error: errorMessage, isLoading: false });
      return { success: false, message: errorMessage };
    }
  },

  // Reset error state
  checkCartError: () => {
    set({ error: null });
    return { success: true, message: "Error state cleared" };
  },
}));
