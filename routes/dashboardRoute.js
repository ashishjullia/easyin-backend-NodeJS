const express = require('express');
const router = express.Router();

const dashboard_controller = require('../controllers/dashboardController');

const { check } = require('express-validator');

// Dashboard Home
router.post('/', dashboard_controller.dashboardHome);

// Create SSH keys
router.post('/addfingerprint', dashboard_controller.addfingerprint);

// // Download Private Key
// router.get('/generatekeys/download', dashboard_controller.download);
//
// // QR Code Link
// router.post('/generatekeys/fileurl', dashboard_controller.fileurl);

router.get('/testget', dashboard_controller.testget);

router.post('/testpost', dashboard_controller.testpost);

// Export 
module.exports = router;