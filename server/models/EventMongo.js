
const { Schema, model } = require('mongoose')


const eventSchema = new Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventSlogan: {
    type: String,
    // required: true,
    trim: true,
  },
  eventDate: {
    // type: Date,
    type: String,
    required: true,
    trim: true,
  },
  eventLength: {
    type: String,
    required: true,
    trim: true,
  },
  eventBody: {
    type: String,
    required: true,
    trim: true,
  },
  eventPhotoURL: {
    type: String,
    required: true,
    trim: true,
  },
  eventCurrent: {
    type: Boolean,
    required: true,
    trim: true,
  },
});

const Event = model('Event', eventSchema, "events");

module.exports = Event;


// !========================= EOF =========================