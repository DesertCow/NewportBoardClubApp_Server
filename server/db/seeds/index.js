
//* Seed Lists
const seedEventDB = require('./events-seeds');
const seedSurfSessionDB = require('./surf-session-seeds');
const seedSurfHackDB = require('./surf-hack-seeds');
const seedShaperListDB = require('./shaper-list-seeds');

//* DB Connection
const mongodb = require('../mongoConnection');

const seedAll = async () => {

  // await seedEventDB();
  // console.log('\n\x1b[43m ~~~ EVENTS SEEDED ~~~ \x1b[0m\n');

  // await seedSurfSessionDB();
  // console.log('\n\x1b[43m ~~~ SURF SESSIONS SEEDED~~~ \x1b[0m\n');

  
  console.log('\n\x1b[43m ~~~ SURF HACKS SEEDED ~~~ \x1b[0m\n');
  await seedSurfHackDB();


  await seedShaperListDB();
  console.log('\n\x1b[43m ~~~ SHAPER LIST SEEDED ~~~ \x1b[0m\n');

  return true;
};

//* Enable NPM seeding to call and force seed via ARGV
if (process.argv[2]) {

  console.log("ARGV = " + process.argv[2])

  if (process.argv[2] === 'seed') {
    seedAll();
  }

}

// const seedMain = async() => {
//   await seedAll();
//   process.exit(0);
// }

// seedMain();

module.exports = seedAll;

//!========================= EOF =========================