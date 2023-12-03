const mongoose = require("mongoose");

const User = mongoose.model(
    // Model Name
    "User",
    // Declare Schema Details
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        // Sets update using data
        updated: { type: Date, default: Date.now },
        // Roles Array
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }]
    },{ timestamps: { createdAt: 'created_at' } })
);

module.exports = User;