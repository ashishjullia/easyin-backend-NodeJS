const express = require('express');
const router = express.Router();

const identities_controller = require('../controllers/identityController');

const { check } = require('express-validator');

// GET all Identities
router.get('/', identities_controller.getAllIdentities);


// Put data
router.post('/postidentity',
    [
        check('email').not().isEmpty()
    ],
    identities_controller.postidentity);

// Export
module.exports = router;