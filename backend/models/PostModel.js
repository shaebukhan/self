const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,

    },
    image: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.ObjectId,
        ref: "Users",
        required: true,
    },
});

//Export the model
module.exports = mongoose.model('Posts', postSchema);