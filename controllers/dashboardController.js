const keygen = require('ssh-keygen');

const fs = require('fs');

const HttpError = require('../models/HttpErrorModel.js');

const { validationResult } = require('express-validator');

const jsonwebtoken = require('jsonwebtoken');


// Create SSH keys
exports.generatekeys = async (req, res, next) => {

};