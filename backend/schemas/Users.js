const { default: mongoose } = require("mongoose");

module.exports = mongoose.model('Users', new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    classes: {
        type: Array,
        required: true,
        default: []
    }
}));