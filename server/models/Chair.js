const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChairSchema = new Schema({
  socketId: {
    type: String,
    index: true,
    required: true,
  },

  chairName: [String],
});

const Chair = mongoose.model('Chair', ChairSchema);

module.exports = Chair;
