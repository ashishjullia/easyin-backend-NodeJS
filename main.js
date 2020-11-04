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

// Preparing the database connection
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, () =>
    console.log('Connection to database is created (DB)')
);

// Make our app use the body-parser
express.use(bodyParser.json());

// Import Routes & register them as "middleware"
// Middlewares

const userRoute = require('./routes/userRoute');
const dashboardRoute = require('./routes/dashboardRoute');

express.use(session({
    secret: "secret",
    saveUninitialized: false,
    resave: true
}))

express.use('/Users', userRoute);
express.use('/Dashboard', dashboardRoute);