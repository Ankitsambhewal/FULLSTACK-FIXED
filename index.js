require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const session    = require('express-session');
const cookieParser = require('cookie-parser');
const path       = require('path');

const app = express();

// ============= DATABASE =============
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Gems Cafe Connected to MongoDB"))
    .catch(err => console.log("❌ DB Error:", err));

// ============= VIEW ENGINE =============
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============= MIDDLEWARE =============
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'gems_cafe_secret',
    resave: false,
    saveUninitialized: false
}));

// ============= AUTH MIDDLEWARE =============
const authMiddleware  = require('./middleware/authMiddleware');
const adminMiddleware = require('./middleware/adminMiddleware');
app.use(authMiddleware);
app.use((req, res, next) => { res.locals.user = req.user || null; next(); });

// ============= ROUTES =============
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes    = require('./routes/cartRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const supportRoutes = require('./routes/supportRoutes');

app.use('/',         authRoutes);
app.use('/products', productRoutes);
app.use('/cart',     cartRoutes);
app.use('/orders',   orderRoutes);
app.use('/support',  supportRoutes);

// ============= ADMIN ROUTES =============
const adminController = require('./controllers/adminController');

app.get('/admin',                    adminMiddleware, adminController.getDashboard);
app.post('/admin/update-order',      adminMiddleware, adminController.updateOrderStatus);
app.post('/admin/add-product',       adminMiddleware, adminController.addProduct);
app.post('/admin/toggle-product/:id',adminMiddleware, adminController.toggleProductAvailability);
app.patch('/admin/toggle-product/:id',adminMiddleware, adminController.toggleProductAvailability);
app.post('/admin/delete-product/:id',adminMiddleware, adminController.deleteProduct);

// ============= HOME =============
app.get('/', (req, res) => res.redirect('/products'));

// ============= 404 =============
app.use((req, res) => {
    res.status(404).render('404', { user: req.user || null });
});

// ============= START =============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Gems Cafe running at http://localhost:${PORT}`));