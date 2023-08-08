//* Surf Hack Seeding File
//*

const mongoose = require('mongoose');
const SurfHack = require('../../models/SurfHacks');



const SurfHackSeed = [

{
  hackTitle: "Wetsuits: How to Wash & Dry",
  hackBody: "<p style=\"text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;\">\n  #1) When you wash your wetsuit, it's better to plunge it in a bucket than to just spray it because it will push out the salt water and soak in the freshwater.  And it helps to use Baby Shampoo if it's a little stinky.\n</p>\n<p style=\"text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;\">\n  #2) When you dry your wetsuit, don't use a hanger.  Not even a \"wetsuit hanger\" because it will still stretch out the shoulders.  It's better to fold it in half over a rail or something.\n</p>",
  hackPhotoURL: "https://theboardclubsurfhacks.s3.us-west-1.amazonaws.com/Surf_Hacks_Wetsuit_Wash.jpg"
},
{
  hackTitle: "Pick Up Trash",
  hackBody: "<p style=\"text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;\">\nIt's hard not to find trash on your way off the beach after a session. With summer crowds, there's tons of trash on our beaches. Do yourself, your fellow surfers and Mother Ocean a favor, and pick some up when you're leaving the beach.\n</p>\n<p style=\"text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;\">\nSo, where's the hack in all of this? The ocean gives back! Karma is real. We're guaranteeing you get a great wave your next session if you leave the beach cleaner than when you got there. \n</p>",
  hackPhotoURL: "https://theboardclubsurfhacks.s3.us-west-1.amazonaws.com/Surf_Hacks_Trash.jpg"
},
{
  hackTitle: "Use Landmarks",
  hackBody: "<p style=\"text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;\">\nWaves will typically break in the same spot throughout your surf session because of an underwater reef or sandbar that causes the waves to break.  But with currents pushing along the coastline, you'll often find yourself drifting away from where you want to be.\n</p>\n<p style=\"text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;\">\nSo, the next time you surf, pay attention to where the best waves are consistently breaking, paddle to that exact location, and then turn around towards the shore to find a foreground and background landmark that will line you up to the perfect spot.\n</p>\n<p style=\"text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;\">\nIn the example above, the surfer in the green wetsuit has found the best take off spot and can now line up the corner of the building with a recognizable part of the mountain.  Other potential options: A lifeguard tower with a palm tree behind it, an umbrella and a specific house on the boardwalk, or a trashcan on the beach and a car in the parking lot.  The possibilities are endless.\n</p>\n<p style=\"text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;\">\nThis might be a difficult concept to grasp so feel free to reply to this email with any questions or ask for a more detailed explanation next time you visit the club.\n</p>",
  hackPhotoURL: "https://theboardclubsurfhacks.s3.us-west-1.amazonaws.com/SurfHacks_Landmarks.jpg"
},

];

 const seedSurfHack = async () => {

  await SurfHack.deleteMany({});
  await SurfHack.insertMany(SurfHackSeed);
 };

module.exports = seedSurfHack;