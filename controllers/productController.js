const Product = require("../models/product");

// ================= GET PRODUCTS (Menu Page) =================
exports.getProducts = async (req, res) => {
  try {
    const category = req.query.category || "all";
    const search   = req.query.search   || "";

    let filter = {};

    // ✅ Show available products to everyone (logged in or guest)
    filter.isAvailable = true;

    // Category filter
    if (category !== "all") {
      filter.category = category.toLowerCase();
    }

    // Search filter
    if (search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    const products = await Product.find(filter).sort({ category: 1 });

    console.log(`📦 Products: ${products.length} | Category: ${category} | User: ${req.user ? req.user.name : 'Guest'}`);

    res.render("products", {
      products,
      user:             req.user || null,
      selectedCategory: category,
      search
    });

  } catch (error) {
    console.error("❌ Product Page Error:", error);
    res.status(500).send("Server Error");
  }
};