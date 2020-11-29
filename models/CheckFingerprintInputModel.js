const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let checkFingerprintInputSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
});

// Exporting the model
module.exports = mongoose.model('checkFingerprintInput', checkFingerprintInputSchema);