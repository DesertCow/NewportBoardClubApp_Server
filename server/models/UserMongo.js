const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  memberEmail: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, '👻👻 Email Address is Invalid! 👻👻'],
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  clubPassword: {
    type: String,
    required: true,
    trim: true,
  },
  memberFirstName: {
    type: String,
    required: true,
    trim: true,
  },
  memberLastName: {
    type: String,
    required: true,
    trim: true,
  },
  registerDate: {
    type: Date,
    required: true,
    trim: true,
  }
});

//* set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
  // console.log('New User Triggered Via Middleware during MongoDB Create');
  // if (this.isNew || this.isModified('password')) {
  if (this.isNew) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// userSchema.methods.updatePassword('updateOne', { document: true, query: false }, async function (next) {
userSchema.methods.generateHash = async function (password) {

  const saltRounds = 10;
  password = await bcrypt.hash(password, saltRounds);

  return password
  // 
};

//* compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {

  // console.log("PASSWORD: " + password + "|| THIS PASSWORD:" + this.password)
  if (password == this.password) {
    console.log("Pre Hashed Password")
    console.log(password + " == " + this.password)
    return true
  }
  return await bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;


// !========================= EOF =========================