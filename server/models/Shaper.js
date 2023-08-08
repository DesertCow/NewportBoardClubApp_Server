const { Schema, model } = require('mongoose')


const shaperSchema = new Schema({
  shaperName: {
    type: String,
    required: true,
  },
});

const Shaper = model('Shaper', shaperSchema, "shapers");

module.exports = Shaper;


// !========================= EOF =========================