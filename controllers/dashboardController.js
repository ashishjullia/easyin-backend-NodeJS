const keygen = require('ssh-keygen');

const fs = require('fs');

const HttpError = require('../models/HttpErrorModel.js');

const { validationResult } = require('express-validator');

const jsonwebtoken = require('jsonwebtoken');

const UserFingerprint = require('../models/UserFingerprintModel');

const testDashboard = require('../models/TestModel');

exports.testget = async (req, res, next) => {
    var result = async ()=>{
        let testExists;
        testExists = await testDashboard.findOne({ email: "one@example.com" });
        if (testExists.status == true) {
            return res.json({ message: "All good",
                status: true
            });
            clearInterval(value);
        }
        else {
            return res.json({
                message: "Not good",
                status: false
            });
        }
    }
    var value = setInterval(result, 10000);

};

exports.testpost = async (req, res, next) => {
    // const { email } = req.body;
    const newTest = new testDashboard({
        email: "one@example.com",
        status: true
    });

    const savedTest =  await newTest.save();
    return res.json({
        message: "Test Done",
        status: true
    });
};


exports.dashboardHome = async (req, res, next) => {
    const { token, userId } = req.session;

    console.log(token,userId)

    try {
        //check if user is logged in
        if(token){
            return  res.status(201).json({
                message: "Welcome To Dashboard",
                status: true,
                session: req.session
            });
        }
        else{
            //if the user is not logged in
            return res.status(200).json({
                message: "No user logged in",
                status: false,
                session: req.session
            });
        }
        } catch (err) {
        return res.json(err)
    }
};

// Add fingerprint
exports.addfingerprint = async (req, res, next) => {

    const { token, userId, email } = req.session;

    console.log(token,userId)
    console.log("session")
    console.log(req.session)
    console.log("session end")

    try {
        //check if user is logged in
        if(token){
            // Check whether user is already registered or not
            let userFingerprintExists;
            try {
                userFingerprintExists = await UserFingerprint.findOne({ id: userId, email: email, fingerprint: true });
            } catch (err) {
                return res.json("Fingerprint adding failed!");
            }

            if (userFingerprintExists) {
                return res.json({
                    message: "User already registered for fingerprint, try using the passwordless option.",
                    status: false
                });
            }
            else {
                // creating a new userFingerprint from the data being sent via a post request
                const newUserFingerprint = new UserFingerprint({
                    id: userId,
                    email: email,
                    fingerprint: true
                });

                // save the data to the User model/collection
                try {
                    const savedUser =  await newUserFingerprint.save();

                    var QRCode = require('qrcode')
                    // QRCode.toString(email, {type:'terminal'}, function (err, url) {
                    //     console.log(url)
                    const file = __dirname + '/../QrCodes/qrcode.png';
                    QRCode.toFile(file, 'Some text', {
                        color: {
                            dark: '#00F',  // Blue dots
                            light: '#0000' // Transparent background
                        }
                    }, function (err) {
                        return res.sendFile(file);
                        // res
                        //     .status(201)
                        //     .json({
                        //         email: file,
                        //         status: true
                        //     });
                    });
                } catch (err) {
                    return res.json({
                        message: "Already Added!",
                        status: false
                    });
                }
            }
        }
        else{
            //if the user is not logged in
            return res.status(200).json({
                message: "No user logged in",
                status: false,
                session: req.session
            });
        }
    } catch (err) {
        return res.json(err)
    }
};

// exports.fileurl = async (req, res, next) => {
//     var QRCode = require('qrcode')
//     QRCode.toString('http://10.88.116.19:8080/dashboard/generatekeys/download', {type:'terminal'}, function (err, url) {
//         console.log(url)
//     });
//     res.json({ message: "Done!" });
// };

// exports.download = async (req, res, next) => {
//
//     const { token, userId } = req.session;
//     console.log(userId);
//         if(userId) {
//             return res.json({
//                 message: userId,
//                 file: true
//             });
//         }
//         else {
//             return res.json({
//                 message: "No user Logged In",
//                     file: false
//             });
//         }
// };
//
// exports.fileurl = async (req, res, next) => {
//     const { token, userId, email } = req.session;
//     console.log(token,userId, email)
//    
//     try {
//         //check if user is logged in
//         if(token){
//             return res.json("hello")
//         }
//         else{
//             //if the user is not logged in
//             return res.status(200).json({
//                 message: "No user logged in",
//                 status: false,
//                 // session: req.session
//             });
//         }
//     } catch (err) {
//         return res.json(err)
//     }
//
//     // res.json({ message: "Done!" });
// };
