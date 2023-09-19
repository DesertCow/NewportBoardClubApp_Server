// #####################################################################
// 
// 
//
// Clayton Skaggs August 2023
// 
// ---------------------------------------------------------------------

const { ApolloServer, gql } = require("@apollo/server");
const express = require("express");

const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { ApolloServerPluginLandingPageDisabled } = require('@apollo/server/plugin/disabled');

const cors = require("cors");

var corsOptions = {
  origin: 'https://boardclubapp-production.up.railway.app',
  // origin: 'http://localhost:3001',
  // origin: 'http://localhost:8081',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const http = require('http');

const bodyParser = require('body-parser');

const path = require('path');
const helmet = require("helmet");

const { expressMiddleware } = require("@apollo/server/express4");

//* Import SQL and GraphQL ports from ENV file
const mySQLport = process.env.mySQLport || 3001;
const graphQLport = process.env.PORT || 4001;

//* DB Connections
const db = require('./db/mongoConnection');



//* DB Seed Function

const seedAll = require('./db/seeds/index');

async function seedServer() {

  try {
    await seedAll();
    console.log('\n\x1b[42m----- SEEDING COMPLETE/VALID -----\x1b[0m\n');
  } catch (error) {
    console.log('\n\x1b[41m----- SEEDING FAILED! -----\x1b[0m\n');
    console.log(error);
  }
}

//* DB Schema / Seeds
const { typeDefs, resolvers } = require('./db/schemas');


//* Create Base "App"
const app = express();
const httpServer = http.createServer(app);


//* Define Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: 
    [ApolloServerPluginDrainHttpServer({ httpServer })]
    // [ApolloServerPluginLandingPageDisabled()],
});

//* Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 40,
});

//* Rate Limiter Enforcement
app.use(limiter);

//* Cors Apply *
app.options('*', cors()) // include before other routes


console.log("\n\x1b[34mServer Import Complete \nStarting Connections...\x1b")


//* Starts all backend servers and DB connections
async function serverStart() {

  //* Start ApolloServer
  await server.start();

  //* Start GraphQLServer
  app.use(
    '/',

    //* Apply Cors Config
    cors(corsOptions),

    // 50mb is the limit that `startStandaloneServer`
    bodyParser.json({ limit: '50mb' }),

    //* Middleware Injection
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),

    //* Enable CDN packages TLD
    helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net", "unpkg.com"],
    },
    }),
  );

  //* Start mongoDB Connection
  db.once('open', () => {

    console.log("\n\x1b[36m---       \x1b[33mServer Status\x1b[36m       ---")
    console.log("---------------------------------")
    console.log('---\x1b[30m MongoDB Database [' + "\x1b[32mOnline\x1b[0m" + ']\x1b[36m ---')

    // * Start GraphQL Server
    app.listen(graphQLport, () => {
      console.log(`---\x1b[30m GraphQL API      [` + "\x1b[32mOnline\x1b[0m" + `] \x1b[36m---`);
      console.log("---------------------------------\x1b[30m\n")
      console.log(`\x1b[31mAPI Live:\x1b[0m http://192.168.25.22:${graphQLport}\n`);
      
    })
  })


}



//* ========== Main ===========

// * Main Server Call
console.log("\n\x1b[34mStart Server...\x1b[0m")
serverStart();
console.log("\x1b[33mServer Start Complete!\x1b[0m")

//* ========== EOM ===========