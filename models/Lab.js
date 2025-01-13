const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  capacidade: { type: Number },
  foto: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files', required: true },
}, { timestamps: true, collection: "Lab" });

module.exports = mongoose.model('Lab', LabSchema);
