const User   = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey";

// ================= SHOW LOGIN =================
exports.showLogin = (req, res) => {
  if (req.user) return res.redirect("/products");
  const redirect = req.query.redirect || "";
  res.render("login", { user: null, error: null, redirect });
};

// ================= SHOW SIGNUP =================
exports.showSignup = (req, res) => {
  if (req.user) return res.redirect("/products");
  res.render("signup", { user: null, error: null, redirect: "" });
};

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.render("signup", {
        user: null,
        error: "All fields are required!",
        redirect: ""
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("signup", {
        user: null,
        error: "Email already registered!",
        redirect: ""
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password: hashedPassword,
      role:     "user"
    });

    const token = jwt.sign(
      { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log(`✅ New user: ${newUser.name}`);
    res.redirect("/products");

  } catch (err) {
    console.error("Signup Error:", err);
    res.render("signup", {
      user: null,
      error: "Something went wrong. Try again!",
      redirect: ""
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password, redirect } = req.body;

    if (!email || !password) {
      return res.render("login", {
        user: null,
        error: "Email and password are required!",
        redirect: redirect || ""
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.render("login", {
        user: null,
        error: "Email not registered!",
        redirect: redirect || ""
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        user: null,
        error: "Incorrect password!",
        redirect: redirect || ""
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log(`✅ Login: ${user.name} (${user.role})`);

    // ✅ Admin → /admin
    if (user.role === "admin") return res.redirect("/admin");

    // ✅ Came from cart → /cart
    if (redirect === "cart") return res.redirect("/cart");

    // ✅ Normal user → /products
    res.redirect("/products");

  } catch (err) {
    console.error("Login Error:", err);
    res.render("login", {
      user: null,
      error: "Something went wrong!",
      redirect: ""
    });
  }
};

// ================= LOGOUT =================
// ✅ Logout → /products (guest can still see menu)
exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ success: true, redirect: "/products" });
};