const Order = require("../models/Order");

// ================= GET ORDER PAGE =================
exports.getOrderPage = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const userOrders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.render("order", { user: req.user, orders: userOrders });

  } catch (error) {
    console.error("Order Page Error:", error);
    res.status(500).send("Server Error");
  }
};

// ================= PLACE ORDER =================
exports.placeOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Login required" });
    }

    const { items, pickupTime } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!pickupTime) {
      return res.status(400).json({ success: false, message: "Pickup time required" });
    }

    const formattedItems = items.map(item => ({
      productId: item.productId || null,
      name:      item.name,
      price:     Number(item.price),
      quantity:  Number(item.quantity)
    }));

    const totalAmount = formattedItems.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    const newOrder = new Order({
      user:      req.user.id,
      userName:  req.user.name  || "",
      userEmail: req.user.email || "",
      items:     formattedItems,
      totalAmount,
      pickupTime,
      status: "Pending"
    });

    await newOrder.save();
    console.log(`✅ New order by ${req.user.name} | ₹${totalAmount}`);

    return res.status(200).json({ success: true, message: "Order placed!" });

  } catch (error) {
    console.error("❌ Order Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};