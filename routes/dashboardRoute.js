const express = require('express');
const router = express.Router();

const dashboard_controller = require('../controllers/dashboardController');

const { check } = require('express-validator');

// Dashboard Home
router.post('/', dashboard_controller.dashboardHome);

// Create SSH keys
router.post('/addfingerprint', dashboard_controller.addfingerprint);

router.post('/removefingerprint', dashboard_controller.removefingerprint);

// Export 
module.exports = router;