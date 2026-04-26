import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const placeOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;

    // ❌ safety check
    if (!userId || !address) {
      return res.status(400).json({ message: "UserId or Address missing" });
    }

    // ✅ get cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ prepare order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    // ✅ total
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // ✅ reduce stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // ✅ create order
    const order = await Order.create({
      userId,
      items: orderItems,
      address,
      totalAmount,
      paymentMethod: "COD",
    });

    // ✅ clear cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id, // ✅ spelling fix
    });

  } catch (error) {
    console.error("ORDER ERROR:", error); // 👈 VERY IMPORTANT
    res.status(500).json({ message: "Internal server error" });
  }
};