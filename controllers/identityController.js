const { validationResult } = require('express-validator');

const jsonwebtoken = require('jsonwebtoken');

const Identity = require('../models/IdentityModel.js');

exports.getAllIdentities = async (req, res, next) => {
    let allIdentities = await Identity.find({});

    var ids = [];

    console.log(allIdentities);
    for(var i = 0; i < allIdentities.length ; i++){
        var id = new Object()
        id.email = allIdentities[i].email
        ids.push(id)
        }
    console.log(ids)
    res.json(ids);
};

exports.postidentity = async (req, res, next) => {
    // Validating the data before creating a user
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return next(
            new HttpError('Invalid inputs, please provide correct data!', 422)
        );
    }

    const { email } = req.body;

    // Check whether identity already there or not.
    let identity;

    const newIdentity = new Identity({
        email: email
    });

    const saveIdentity = await newIdentity.save();
    res.status(201).json(saveIdentity);
};