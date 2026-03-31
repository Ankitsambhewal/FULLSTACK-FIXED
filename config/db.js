const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    // Validation: Check if URI exists
    if (!uri) {
      console.error("❌ Error: MONGO_URI is not defined in your .env file!");
      console.log("Tip: Check if .env file is in the root of 'fullstack' folder.");
      process.exit(1);
    }

    // Connection attempt
    const conn = await mongoose.connect(uri);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;