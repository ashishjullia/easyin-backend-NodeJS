const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstname: {
        type: String, 
        required: true, 
        max: 40
    },
    lastname: {
        type: String, 
        required: true, 
        max: 40
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    }
});

// Exporting the model
module.exports = mongoose.model('Users', userSchema);