const express = require('express');
const router = express.Router();

const dashboard_controller = require('../controllers/dashboardController');

const { check } = require('express-validator');

// Create SSH keys
router.post('/generatekeys', dashboard_controller.generatekeys);

// Export 
module.exports = router;