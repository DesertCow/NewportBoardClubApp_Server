const { Schema, model } = require('mongoose')


const surfHackSchema = new Schema({
  hackTitle: {
    type: String,
    required: true,
  },
  hackBody: {
    type: String,
    required: true,
    trim: true,
  },
  hackPhotoURL: {
    type: String,
    required: true,
    trim: true,
  },
});

const SurfHack = model('SurfHack', surfHackSchema, "surfhacks");

module.exports = SurfHack;


// !========================= EOF =========================