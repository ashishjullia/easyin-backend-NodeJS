const express = require('express');
const router = express.Router();

const users_controllers = require('../controllers/userController');

const { check } = require('express-validator');


router.get('/sessioncheck', users_controllers.sessionCheck);

// GET all Users
router.get('/', users_controllers.getAllUsers);

// Delete all users
router.post('/clean', users_controllers.deleteAllUsers);

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

// USER login Passwordless
router.post('/login/passwordless',
    [
        check('email').not().isEmpty()
    ],
    users_controllers.logInPasswordLess);

// USER logout
router.post('/logout', users_controllers.logOut);

// Set fingerprint input
router.post('/setfingerprintinput', users_controllers.setFingerprintInputFromMobileDevice);

// Export 
module.exports = router;
