const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');
const session = require('express-session');

// Prepare express
const expressInstance = require('express');
const express = new expressInstance();
const server = http.createServer(express);

// Preparing and creating server
server.listen(8080, '0.0.0.0', function() {
    var addr = server.address();
    console.log(`API is running and listening on -> ${addr.address}:${addr.port}`);
});