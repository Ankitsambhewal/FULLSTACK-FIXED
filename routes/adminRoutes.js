const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

router.get('/', adminMiddleware, adminController.getDashboard);
router.post('/update-order', adminMiddleware, adminController.updateOrderStatus);
router.post('/add-product', adminMiddleware, upload.single('image'), adminController.addProduct);
router.patch('/toggle-product/:id', adminMiddleware, adminController.toggleProductAvailability);

module.exports = router;
