require('dotenv').config();
const mongoose = require('mongoose');

// ============= PRODUCT SCHEMA (inline) =============
const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    price:       { type: Number, required: true, min: 0 },
    image:       { type: String, required: true },
    category:    { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// ============= SEED DATA =============
const products = [
  // -------- FAST FOOD --------
  {
    name: "Chicken Burger",
    price: 250,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    category: "fast food",
    description: "Juicy crispy chicken burger with lettuce & sauce",
    isAvailable: true
  },
  {
    name: "Beef Pizza",
    price: 450,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
    category: "fast food",
    description: "Cheesy loaded beef pizza with fresh toppings",
    isAvailable: true
  },
  {
    name: "French Fries",
    price: 150,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500",
    category: "fast food",
    description: "Golden crispy salted french fries",
    isAvailable: true
  },
  {
    name: "Veggie Wrap",
    price: 180,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500",
    category: "fast food",
    description: "Fresh grilled veggie wrap with garlic sauce",
    isAvailable: true
  },
  {
    name: "Chicken Nuggets",
    price: 200,
    image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=500",
    category: "fast food",
    description: "Crispy chicken nuggets with dipping sauce",
    isAvailable: true
  },

  // -------- DESSERTS --------
  {
    name: "Chocolate Cake",
    price: 300,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
    category: "desserts",
    description: "Rich dark chocolate layered cake",
    isAvailable: true
  },
  {
    name: "Vanilla Ice Cream",
    price: 180,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500",
    category: "desserts",
    description: "Creamy smooth vanilla ice cream scoop",
    isAvailable: true
  },
  {
    name: "Brownie",
    price: 220,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500",
    category: "desserts",
    description: "Warm fudgy chocolate brownie",
    isAvailable: true
  },
  {
    name: "Cheesecake",
    price: 280,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500",
    category: "desserts",
    description: "Creamy New York style cheesecake",
    isAvailable: true
  },

  // -------- DRINKS --------
  {
    name: "Mango Shake",
    price: 200,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500",
    category: "drinks",
    description: "Fresh chilled mango milkshake",
    isAvailable: true
  },
  {
    name: "Coca Cola",
    price: 100,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500",
    category: "drinks",
    description: "Ice cold Coca Cola can",
    isAvailable: true
  },
  {
    name: "Cold Coffee",
    price: 220,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500",
    category: "drinks",
    description: "Chilled blended cold coffee with cream",
    isAvailable: true
  },
  {
    name: "Lemon Mint Juice",
    price: 130,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500",
    category: "drinks",
    description: "Refreshing lemon mint cooler",
    isAvailable: true
  }
];

// ============= RUN SEED =============
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await Product.deleteMany({});
    console.log("🗑️  Old products cleared");
    await Product.insertMany(products);
    console.log(`✅ ${products.length} Products seeded successfully!`);
    console.log("🍔 Fast Food: 5 items");
    console.log("🍰 Desserts:  4 items");
    console.log("🥤 Drinks:    4 items");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  });