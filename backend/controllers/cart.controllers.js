import Cart from "../models/cart.model.js";

// Fetch user's cart
export const getCart = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
        }

        // Fetch the user's cart
        const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId', 'name price');

        if (!cart) {
            return res.status(200).json({ success: true, message: 'Cart is empty', cart: { items: [], subTotal: 0 } });
        }

        res.status(200).json({ success: true, message: 'Cart fetched successfully', cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    const { productId, quantity, price, image } = req.body;

    if (!productId || !quantity || !price) {
        return res.status(400).json({ success: false, message: 'Product ID, quantity, and price are required' });
    }

    if (quantity <= 0 || price <= 0) {
        return res.status(400).json({ success: false, message: 'Quantity and price must be greater than 0' });
    }

    try {
        let cart = await Cart.findOne({ userId: req.user.userId });

        if (!cart) {
            // Create new cart if it does not exist
            cart = new Cart({
                userId: req.user.userId,
                items: [{ productId, quantity, price, image, total: quantity * price }],
                subTotal: quantity * price
            });
        } else {
            // Find the item in the cart
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

            if (itemIndex > -1) {
                // Update quantity if item exists
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].total = cart.items[itemIndex].quantity * price;
            } else {
                // Add new item to cart
                cart.items.push({ productId, quantity, price, image, total: quantity * price });
            }

            // Recalculate subtotal
            cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);
        }

        await cart.save();
        res.status(200).json({ success: true, message: 'Item added to cart', cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding item to cart', error: error.message });
    }
};

// Remove item from cart
// Remove item from cart
export const removeFromCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.user.userId }); // ✅ Fix userId reference

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Filter out the product from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Recalculate the subtotal
        cart.subTotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({ success: true, message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing item from cart', error: error.message });
    }
};


// Update item quantity
export const updateQuantity = async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Product ID and valid quantity are required' });
    }

    try {
        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Find the item and update quantity
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].total = quantity * cart.items[itemIndex].price;

        // Recalculate subtotal
        cart.subTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

        await cart.save();
        res.status(200).json({ success: true, message: 'Item quantity updated', cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating quantity', error: error.message });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.user.userId },
            { items: [], subTotal: 0 },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.status(200).json({ success: true, message: 'Cart cleared', cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error clearing cart', error: error.message });
    }
};
