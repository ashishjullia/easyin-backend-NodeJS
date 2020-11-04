const express = require('express');
const router = express.Router();

const users_controllers = require('../controllers/userController');

const { check } = require('express-validator');

// GET all Users
router.get('/', users_controllers.getAllUsers);

// CREATE a user
router.post('/signup',
    [
        check('firstname').not().isEmpty(),
        check('lastname').not().isEmpty(),
        check('email').not().isEmpty().isEmail().normalizeEmail(),
        check('password').not().isEmpty()
    ],    
    users_controllers.signUp);

// USER login
router.post('/login', 
    [
        check('email').not().isEmpty().isEmail().normalizeEmail(),
        check('password').not().isEmpty()
    ],
    users_controllers.logIn);

// USER logout
router.post('/logout', users_controllers.logOut);

// Export 
module.exports = router;