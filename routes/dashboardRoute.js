const express = require('express');
const router = express.Router();

const dashboard_controller = require('../controllers/dashboardController');

const { check } = require('express-validator');

// Create SSH keys
router.post('/generatekeys', dashboard_controller.generatekeys);

// Download Private Key
router.get('/generatekeys/download', dashboard_controller.download);

// QR Code Link 
router.post('/generatekeys/fileurl', dashboard_controller.fileurl);

// Export 
module.exports = router;