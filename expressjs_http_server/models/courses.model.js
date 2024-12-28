const mongose = require('mongoose');

const courseSchema = new mongose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongose.model('Course', courseSchema);