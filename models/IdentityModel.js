const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let identitySchema = new Schema({
    email: {
        type: String, 
        required: true, 
        max: 40
    }
});

// Exporting the model
module.exports = mongoose.model('Identities', identitySchema);