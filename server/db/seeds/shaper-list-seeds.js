//* Shaper List Seeding File
//*

const mongoose = require('mongoose');
const Shaper = require('../../models/Shaper')



const ShaperSeed = [

  {
    shaperName: "Baltierra Surfboards"
  },
  {
    shaperName: "Solid Surf"
  },
  {
    shaperName: "Almond Surfboards"
  },
  {
    shaperName: "DHD Surfboards"
  },
  {
    shaperName: "Tanner Surfboards"
  },
  {
    shaperName: "Guy Takayama"
  },
  {
    shaperName: "Robert August"
  },
  {
    shaperName: "Dano Surfboards"
  },
  {
    shaperName: "Album Surf"
  },
  {
    shaperName: "Brink Surf"
  },
  {
    shaperName: "Lost Surboards"
  },
  {
    shaperName: "Surf Prescriptions"
  },
  {
    shaperName: "Thread Surfboards"
  },
  {
    shaperName: "Estrada Surfboard Design"
  },

];

 const seedShaperList = async () => {

  await Shaper.deleteMany({});
  await Shaper.insertMany(ShaperSeed);
 };

module.exports = seedShaperList;