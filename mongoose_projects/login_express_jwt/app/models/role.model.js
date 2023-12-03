const mongoose = require("mongoose");

const Role = mongoose.model(
    // ModelName
    'Role',
    // Schema Definition
    new mongoose.Schema({
        name: String
    },{ timestamps: { createdAt: 'created_at' } })
)

module.exports = Role;