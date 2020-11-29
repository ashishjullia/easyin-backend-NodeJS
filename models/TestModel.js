const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let testSchema = new Schema({
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
module.exports = mongoose.model('dashboardTests', testSchema);