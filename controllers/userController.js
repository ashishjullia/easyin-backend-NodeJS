const User = require('../models/UserModel');

const bcrypt = require('bcryptjs');


const { validationResult } = require('express-validator');

const jsonwebtoken = require('jsonwebtoken');

const UserFingerprint = require('../models/UserFingerprintModel');

const CheckFingerprint = require('../models/CheckFingerprintInputModel');

// check for session
exports.sessionCheck = async (req, res, next) => {
    try {if (req.session.email) {
        return res.json({
            status: true
        });

    }
    else {
        return res.json({
            status: false
        });
    }}
    catch (err) {
        return res.json({ message: err });
    }
};

// CREATE a user
exports.signUp = async (req, res, next) => {
    // Validating the data before creating a user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return next(
        //     new HttpError('Invalid inputs, please provide correct data!', 422)
        // );
        return res.json("Invalid inputs, please provide correct data!");
    }

    const { firstname, lastname, email, password } = req.body;

    // Check whether user is already registered or not
    let userExists;
    try {
        userExists = await User.findOne({ email: email });
    } catch (err) {
        return res.json("Sign up failed!");
    }

    if (userExists) {
        return res.json({
            message: "User already registered with this email, try logging in instead!",
            status: false
        });
    }

    // Crypt the password before saving it
    let cryptPassword;
    // 10 = salting rounds
    try {
        cryptPassword = await bcrypt.hash(password, 10);
    } catch (err) {
        return res.json("Could not create user, at this time, try again later!");
    } 

    // creating a new user from the data being sent via a post request
    const newUser = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: cryptPassword,
    });
    
    // save the data to the User model/collection
    try {
        const savedUser =  await newUser.save();
        return res
            .status(201)
            .json({
                message: "User Added!",
                status: true
            });
    } catch (err) {
        return res.json(err);
    }

    // Generate a token
    let token;
    try {
        token = jsonwebtoken.sign(
            {userId: newUser.id}, 
            'secret', 
            {expiresIn: '1h'});
    } catch (err) {
        return res.json("Could not create user, at this time, try again later!");
    } 
};

// USER login
exports.logIn = async (req, res, next) => {
    sess = req.session;
    if (sess != undefined && sess.loggedIn != undefined) {

        return res.json({
            message: "A user is already logged in.",
            status: false
        });
    }

    // Validating the data before anything else
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ message: "Invalid inputs, please provide correct data!" });
    }

    const { email, password } = req.body;

    // Step 1: grab the email/user from the database
    // Check whether user is already registered or not
    let userExists;
    try {
        userExists = await User.findOne({ email: email });
    } catch (err) {
        return res.json({ message: "Logging in failed, try again later!" });
    }
    
    // Step 2: compare its email and password with the passed/fetched
    if (!userExists) {
        return res.json({ message:"User not registered, logging in failed!" });
    }
    
    let validPassword = false;
    try {
        validPassword = await bcrypt.compare(password, userExists.password);
    } catch (err) {
        return res.json({ message:"Cannot log in, please check credentials!" });
    }
    
    if (!validPassword) {
        return res.json({ message:"Invalid Credentials, logging in failed!" });
    }

    // if all the upper validations are valid, only then we'll generate and give token to this user
    // Generate token, make sure to use the same "secret" used above in "signup"
    let token;
    try {
        token = jsonwebtoken.sign(
            {userId: userExists.id}, 
            'secret', 
            {expiresIn: '1h'});
        if (sess.loggedIn === undefined) {
            sess.loggedIn = true;
            sess.email = userExists.email;
            sess.userId = userExists.id;
            sess.token = token; 
        }
        // req.session = sess;
        console.log(req.session);
        console.log(sess);
    } catch (err) {
        return res.json({ message:"Logging in failed, at this time, try again later!" });
    } 
    
    res.append('token', token);
    return res.status(201).json({
        message: "User Logged In",
        status: true,
        session: req.session
    });
};

// PasswordLess
exports.logInPasswordLess = async  (req, res, next) => {
    var intervalFun = async ()=>{

    sess = req.session;

    console.log(req.session);
    console.log(req.body);

    if (sess != undefined && sess.loggedIn != undefined) {
        return res.json({ message: "A user is already logged in.",
            status: false });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ message: "Invalid inputs, please provide correct data!" });
    }

    const { email } = req.body;

    // Check whether user is registered for fingerprint or not
    let userFingerprintExists;
    try {
        let userExists;
        try {
            userExists = await User.findOne({ email: email });

            if (userExists) {
                userFingerprintExists = await UserFingerprint.findOne({ id: userExists._id, email: email, fingerprint: true });
                let userFingerprintInputExists;
                userFingerprintInputExists = await CheckFingerprint.findOne({ email: email });
                if (userFingerprintInputExists) {
                    clearInterval(value);
                }
                // clearInterval(value);
            } else {
                return res.json({ message: "User not registered!" });
            }
        } catch (err) {
            return res.json({ message: "Logging in failed, try again later!" });
        }

    } catch (err) {
        return res.json({ message: "Logging with Fingerprint failed!" });
    }

    if (userFingerprintExists) {
        let token;
        try {
            token = jsonwebtoken.sign(
                {userId: userFingerprintExists.id},
                'secret',
                {expiresIn: '1h'});
            if (sess.loggedIn === undefined) {
                sess.loggedIn = true;
                sess.email = userFingerprintExists.email;
                sess.userId = userFingerprintExists.id;
                sess.token = token;
            }
        } catch (err) {
            return res.json({ message: "Logging in failed, at this time, try again later!" });
        }

        res.append('token', token);
        return res.status(201).json({
            message: "User Logged In With Fingerprint",
            status: true,
            session: req.session
        });
    } else {
            return res.json({
                message: "User not registered for fingerprint login!",
                status: false
            });
    }
    }
    var value = setInterval(intervalFun, 10000);
};


// USER LogOut
exports.logOut = async (req, res, next) => {
    try {
        if (req.session.loggedIn !== undefined ) {
            req.session.destroy();
            sess = null;
            console.log(req.session);
            res.clearCookie('connect.sid')
            return res.json({
                message: "logout",
                status: true
            });
        }
        else {
            return res.json({
                message: "No user is logged in.",
                status: false
            });
        }
    } catch (err) {
        return res.json({
            message: "Unable to destroy session.",
            status: false
        });
    }
}

// GET all Users
exports.getAllUsers = async (req, res, next) => {
    let allUsers;
    try {
        allUsers = await User.find();
        if (!allUsers.isEmpty) {
            res.json({ "users": allUsers });
        }
    } catch (err) {
        const error = new HttpError('No users found!', 500);
        return next(error);
    }
};

exports.setFingerprintInputFromMobileDevice = async (req, res, next) => {
    try {const { email } = req.body;
    const newFingerprintInput = new CheckFingerprint({
        email: email,
        status: true
    });

    const savednewFingerprintInput =  await newFingerprintInput.save();
    return res.json({
        message: "Input Done",
        status: true
    });}
    catch (err) {
        return res.json({
            message: err
        });
    }
};