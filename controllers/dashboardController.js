const fs = require('fs');

const HttpError = require('../models/HttpErrorModel.js');

const { validationResult } = require('express-validator');

const jsonwebtoken = require('jsonwebtoken');

const UserFingerprint = require('../models/UserFingerprintModel');

exports.dashboardHome = async (req, res, next) => {
    const { token, userId } = req.session;

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
                return res.json({ message: "Fingerprint adding failed!" });
            }
            if (userFingerprintExists) {
                return res.json({
                    message: "User already registered for fingerprint.",
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
                    return res.json({ email: email,
                        message: "Qr Generated",
                        status: true });
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

exports.removefingerprint = async (req, res, next) => {
    const { userId, email, token } = req.session;

    try {
        //check if user is logged in
        if(token){
            console.log(userId,email);
            // Check whether user is already registered or not
            let userFingerprintExists;
            try {
                userFingerprintExists = await UserFingerprint.findOne({ id: userId, email: email, fingerprint: true });
            } catch (err) {
                return res.json({ message: "Fingerprint removing failed!" });
            }
            if (userFingerprintExists) {
                const removeFingerprint = await UserFingerprint.findOneAndDelete({ email: email });
                if (removeFingerprint) {
                    return res.json({
                        message: "Fingerprint Removed",
                        status: true });
                    }
                } else {
                return res.json({
                    message: "Fingerprint Not Registered for this User",
                    status: false });
                }
            }
            else {
            return res.json({
                message: "No user logged in",
                status: false,
                session: req.session
            });
            }
    } catch (err) {
        return res.json(err)
        }
};