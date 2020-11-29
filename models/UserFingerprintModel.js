const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userFingerprintSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fingerprint: {
        type: Boolean,
        default: false,
        required: true
    }
});

// Exporting the model
module.exports = mongoose.model('UsersFingerprints', userFingerprintSchema);