const Order   = require("../models/Order");
const Product = require("../models/Product");
const Support = require("../models/Support");

// ================= ADMIN DASHBOARD =================
exports.getDashboard = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const products = await Product.find().sort({ category: 1 });

    let supportRequests = [];
    try { supportRequests = await Support.find().sort({ createdAt: -1 }); } catch(e) {}

    res.render("adminDashboard", {
      orders:          orders || [],
      products:        products || [],
      supportRequests: supportRequests || [],
      user:            req.user || null
    });

  } catch (err) {
    console.error("Admin Dashboard Error:", err);
    res.status(500).send("Admin Dashboard Error: " + err.message);
  }
};

// ================= UPDATE ORDER STATUS =================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const allowed = ["Pending", "Preparing", "Delivered", "Cancelled"];

    if (!orderId || !status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const updated = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true });

  } catch (err) {
    console.error("Update Order Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= ADD PRODUCT (Image URL only) =================
exports.addProduct = async (req, res) => {
  try {
    const { name, price, category, description, imageUrl } = req.body;

    if (!name || !price || !category) {
      return res.status(400).send("Name, price aur category zaroori hain");
    }

    if (!imageUrl || imageUrl.trim() === "") {
      return res.status(400).send("Image URL zaroori hai");
    }

    await Product.create({
      name:        name.trim(),
      price:       Number(price),
      category:    category.trim().toLowerCase(),
      description: description ? description.trim() : "",
      image:       imageUrl.trim(),
      isAvailable: true
    });

    console.log(`✅ Product added: ${name}`);
    res.redirect("/admin");

  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).send(err.message);
  }
};

// ================= TOGGLE PRODUCT =================
exports.toggleProductAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    product.isAvailable = !product.isAvailable;
    await product.save();

    return res.json({ success: true, isAvailable: product.isAvailable });

  } catch (err) {
    console.error("Toggle Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};