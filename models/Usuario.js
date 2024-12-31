const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
}, {collection: 'Usuario'});

module.exports = mongoose.model('Usuario', UserSchema);
