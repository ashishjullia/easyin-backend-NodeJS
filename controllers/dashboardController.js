const keygen = require('ssh-keygen');

const fs = require('fs');

const HttpError = require('../models/HttpErrorModel.js');

const { validationResult } = require('express-validator');

const jsonwebtoken = require('jsonwebtoken');


// Create SSH keys
exports.generatekeys = async (req, res, next) => {
    
    var location = __dirname + '/../keys/foo_rsa';
    var comment = 'comment';
    var password = '';
    var format = 'PEM';

    keygen({
        location: location,
        read: true,
        comment: comment,
        password: password,
        format: format
    },  function(err, out){
        if(err) return console.log('Something went wront: '+err);
        console.log('keys created!');
        console.log('private key: '+out.key);
        res.json({ message: "keys created!" });
    });
};

exports.download = async (req, res, next) => {

    const file = __dirname + '/../keys/foo_rsa';
    res.download(file); // Set disposition and send it.
};

exports.fileurl = async (req, res, next) => {
    
    var QRCode = require('qrcode')
    QRCode.toString('http://10.88.116.19:8080/dashboard/generatekeys/download', {type:'terminal'}, function (err, url) {
      console.log(url)
    });
    res.json({ message: "Done!" });
};