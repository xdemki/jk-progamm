const mongoose = require('mongoose')

module.exports = mongoose.model('Classes', mongoose.Schema({
    classId: {
        type: String,
        required: true,
        unique: true
    },
    students: {
        type: Array,
        required: true,
        default: []
    },
    teachers: {
        type: Array,
        required: true,
        unique: false,
        default: []
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    
}));