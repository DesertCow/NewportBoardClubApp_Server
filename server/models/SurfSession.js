const { Schema, model } = require('mongoose')


const surfSessionSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  sessionDate: {
    type: String,
    required: true,
  },
  sessionTime: {
    type: String,
    required: true,
    trim: true,
  },
  sessionLocation: {
    type: String,
    required: true,
    trim: true,
  },
  skyConditions: {
    type: String,
    required: true,
    trim: true,
  },
  waveSize: {
    type: String,
    required: true,
    trim: true,
  },
  tideLevel: {
    type: Number,
    // required: true,
    // trim: true,
  },
  tideDirection: {
    type: String,
    // required: true,
    trim: true,
  },
  sessionLength: {
    type: String,
    required: true,
    trim: true,
  },
  surfboardShaper: {
    type: String,
    // required: true,
    trim: true,
  },
  surfboardModel: {
    type: String,
    // required: true,
    trim: true,
  },
  surfboardLengthFT: {
    type: Number,
    // required: true,
    trim: true,
  },
  surfboardLengthIN: {
    type: Number,
    // required: true,
    trim: true,
  },
  surfboardVolume: {
    type: Number,
    // required: true,
    trim: true,
  },
  surfboardFinConfig: {
    type: String,
    // required: true,
    trim: true,
  },
  sessionNotes: {
    type: String,
    // required: true,
    trim: true,
  },
  sessionRating: {
    // type: Integer,
    type: Number,
    // required: true,
    trim: true,
  },
});

// eventSchema.pre('save', async function (next) {
//   console.log('New User Triggered Via Middleware during MongoDB Create');
//   // if (this.isNew || this.isModified('password')) {
//   // if (this.isNew) {
//   //   const saltRounds = 10;
//   //   this.password = await bcrypt.hash(this.password, saltRounds);
//   // }

//   next();
// });


const SurfSession = model('SurfSession', surfSessionSchema, "surfSessions");

module.exports = SurfSession;


// !========================= EOF =========================