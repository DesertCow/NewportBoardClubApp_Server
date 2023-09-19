
//* File Handing and Path for loading default User Profile Picture into server
const fs = require('fs');
const path = require('node:path');

//* Models for MongoDB 
const UserMongo = require('../../models/UserMongo');
const EventMongo = require('../../models/EventMongo');
const SurfSessionMongo = require('../../models/SurfSession');
const SurfHack = require('../../models/SurfHacks');
const Shaper = require('../../models/Shaper')

//* Auth Tools
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { signToken, signAdminToken } = require('../../utils/auth');

// const { useState, useEffect } = require("react");
const fetch = require("node-fetch");
const { response } = require("express");

let previousTide = "null";
let tideRising = "false";

//* API URLs
let surfline36thURL = "https://services.surfline.com/kbyg/spots/batch?cacheEnabled=true&units%5BswellHeight%5D=FT&units%5Btemperature%5D=F&units%5BtideHeight%5D=FT&units%5BwaveHeight%5D=FT&units%5BwindSpeed%5D=MPH&spotIds=5842041f4e65fad6a770882a";
let surflineBatchURL = "https://services.surfline.com/kbyg/spots/batch?cacheEnabled=true&units%5BswellHeight%5D=FT&units%5Btemperature%5D=F&units%5BtideHeight%5D=FT&units%5BwaveHeight%5D=FT&units%5BwindSpeed%5D=MPH&spotIds=584204204e65fad6a7709115%2C5842041f4e65fad6a770882a%2C5842041f4e65fad6a7708e54%2C5842041f4e65fad6a77088ee";
// let realTimeData = "https://api.weather.com/v2/pws/observations/current?stationId=KCANEWPO204&format=json&units=e&apiKey=f157bb453d9d4a5997bb453d9d9a59af";
let realTimeData = "https://api.weather.com/v2/pws/observations/current?stationId=KCANEWPO209&format=json&units=e&apiKey=f157bb453d9d4a5997bb453d9d9a59af";

//* AWS SDK Import
var AWS = require('aws-sdk');

//* Configure AWS Region and Credentials
AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey : process.env.S3_SECRET_KEY
  }
});


//* Create S3 Object/Connection
var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  signatureVersion: 'v4',
  params: { Bucket: process.env.S3_USER_PROFILE_BUCKET }
});


const resolvers = {

  Query: {
    
    getWX: async() => {

      let finalLiveWindSpeed = "null";
      let finalAirTemp = "null";
      let finalWaterTemp = "null";
      let finalLiveTideMSL = "null";
      let finalTideDir = "null";
      let finalClubStatus = false;

      

      //* Fetch Surfline Live Conditions Data
      await fetch(surfline36thURL)
        .then((response) => {
          return response.json();
        })
        .then((surflineDataRaw) => {

          console.log("\x1b[36m\n ☎️  Surfline API Request ☎️ \n         [getWX]\x1b[0m")
          
          finalLiveTideMSL = surflineDataRaw.data[0].tide.current.height;
          finalWaterTemp = surflineDataRaw.data[0].waterTemp.max;

          if(surflineDataRaw.data[0].tide.next.type == "LOW")
          {
            finalTideDir = false;
          }

          if(surflineDataRaw.data[0].tide.next.type == "HIGH")
          {
            finalTideDir = true;
          }

        })

      //* Fetch Real-Time Wind/Tempeture (Weather Undergound)
      await fetch(realTimeData)
        .then((response) => {
          return response.json();
        })
        .then((realTimeData) => {
          finalLiveWindSpeed = realTimeData.observations[0].imperial.windGust;
          finalAirTemp = realTimeData.observations[0].imperial.temp;
        })

      //* Get Current time and determind if club is open
      const currentTime = new Date();

      console.log("Current Time: "+ currentTime.getHours());
        
      // console.log("Current Day: "+ currentTime.getUTCDay());
      // console.log("Current Time (Hours Local): "+ currentTime.getHours());
      // console.log("Current Time (UTC Hours): "+ currentTime.getUTCHours());

      //* Confirm it's not Monday
      if(currentTime.getDay() != 1){

        //* Check it's between 8am and 6pm ()
        // if((currentTime.getHours() >= 8) && (currentTime.getHours() < 18)){
        if((currentTime.getUTCHours() >= 15) || (currentTime.getUTCHours() <= 1)){

          console.log("Current Time: "+ currentTime.getHours());
          finalClubStatus = true;
        }
      }
    
      return {
        wind: finalLiveWindSpeed,
        airTemp: finalAirTemp,
        waterTemp: finalWaterTemp,
        tideMSL: finalLiveTideMSL,
        tideRise: finalTideDir,
        clubStatus: finalClubStatus,
      }

    },

    getWidgetWX: async() => {


      let finalNextTideTime = "null";

      //* Fetch Surfline Live Conditions Data
      await fetch(surflineBatchURL)
        .then((response) => {
          return response.json();
        })
        .then((surflineDataRaw) => {

          console.log("\x1b[36m\n ☎️  Surfline API Request ☎️\n       [getWidgetWX]\x1b[0m")
          
          //* Build Tide String
          finalTideMSL = surflineDataRaw.data[0].tide.current.height;
          finalNextTideType = surflineDataRaw.data[0].tide.next.type;
          finalNextTideTime = new Date(surflineDataRaw.data[0].tide.next.timestamp * 1000);
          finalNextTideHeight = surflineDataRaw.data[0].tide.next.height

          //* Build Surf Height String for Each Spot
          finalSurfHeight56th = surflineDataRaw.data[2].waveHeight.min + "-" + surflineDataRaw.data[2].waveHeight.max;
          finalSurfHeight36th = surflineDataRaw.data[0].waveHeight.min + "-" + surflineDataRaw.data[0].waveHeight.max;
          finalSurfHeightBlackies = surflineDataRaw.data[3].waveHeight.min + "-" + surflineDataRaw.data[3].waveHeight.max;
          finalSurfHeightRiver = surflineDataRaw.data[1].waveHeight.min + "-" + surflineDataRaw.data[1].waveHeight.max;

          //* Build Water and Wind String
          finalWaterTemp = surflineDataRaw.data[0].waterTemp.max;
          finalWindType = surflineDataRaw.data[0].wind.directionType;
          
          //* Logic to determind tide direction
          if(surflineDataRaw.data[0].tide.next.type == "LOW")
          {
            // console.log("Next Tide: " + surflineDataRaw.data[0].tide.next.type)
            finalTideDir = false;
          }

          if(surflineDataRaw.data[0].tide.next.type == "HIGH")
          {
            // console.log("Next Tide: " + surflineDataRaw.data[0].tide.next.type)
            finalTideDir = true;
          }

        })

    //* Fetch Real-Time Wind/Tempeture (Weather Undergound)
    await fetch(realTimeData)
      .then((response) => {
        
        return response.json();

      })
      .then((realTimeData) => {

        // console.log("Temperature (Real-Time): " + JSON.stringify(realTimeData.observations[0].imperial.temp))
        // console.log("Wind (Real-Time): " + JSON.stringify(realTimeData.observations[0].imperial.windSpeed))
        // console.log("UV (Real-Time): " + JSON.stringify(realTimeData.observations[0].solarRadiation))
        
        //TODO: Use Wind Speed or Gust Speed?
        // finalWind = realTimeData.observations[0].imperial.windSpeed;

        // console.log(realTimeData)
        finalWind = realTimeData.observations[0].imperial.windGust;
        
        finalAirTemp = realTimeData.observations[0].imperial.temp;
      })

      return {
        wind: finalWind,
        windType: finalWindType,
        airTemp: finalAirTemp,
        waterTemp: finalWaterTemp,
        tideMSL: finalTideMSL,
        tideRise: finalTideDir,
        nextTideType: finalNextTideType,
        nextTideHeight: finalNextTideHeight,
        nextTideTime: finalNextTideTime.toLocaleTimeString(),
        surfHeight36th: finalSurfHeight36th,
        surfHeight56th: finalSurfHeight56th,
        surfHeightBlackies: finalSurfHeightBlackies,
        surfHeightRiver: finalSurfHeightRiver,
      }



    },

    getCurrentEvents: async() => {

      // var currentEventList = [];
      
      const currentEvents = await EventMongo.find({ eventCurrent: true });

      // console.log(" ~~ Current Event Count = \x1b[31m" + currentEvents.length + "  \x1b[0m~~")

      //* Return List Of Current Events
      // console.log(currentEvents)

      return currentEvents
    },

    getPreviousEvents: async() => {

      var previousEventList = [];
      
      const previousEvents = await EventMongo.find({ eventCurrent: false });

      // console.log(" ~~ Previous Event Count = \x1b[31m" + previousEvents.length + "  \x1b[0m~~")
      
      //* Return List Of History Events
      return previousEvents
    },

    getEvent: async (parent, { eventID }) => {

      // var requestedEventList

      const requestedEvent = await EventMongo.findOne({_id: eventID})

      console.log("   \x1b[33mEvent Requested (" + eventID + ")\x1b[0m")
      // console.log(requestedEvent);

      return requestedEvent

    },

    getEventList: async() => {

      const eventList = await EventMongo.find()

      return eventList;

    },

    getAllUsersSurfSession: async (parent, { userID }) => {
      
      console.log("User Surf Session Request!")
      console.log("UserID: " + userID)
      
      const allUserSurfSessions = await SurfSessionMongo.find({userID: userID})

      return allUserSurfSessions
    },

    getSurfSession: async (parent, { sessionID }) => {

      console.log("Requested Session ID: " + sessionID);

      const requestedSession = await SurfSessionMongo.findOne({_id: sessionID});

      return requestedSession;

    },

    uploadUserProfilePicture: async (parent, { userID }) => {

      console.log("\n   \x1b[33mUser (" + userID +") Has Requested Upload URL for Profile Picture\x1b[0m");

      //* Create Upload File Key based off USERID
      const profileUploadFileName = userID + ".jpg";

      //* Define S3 Params for URL Request
      const s3Params = {
        Bucket: process.env.S3_USER_PROFILE_BUCKET,
        Key: profileUploadFileName,
        Expires: parseInt(process.env.S3_URL_EXPIRATIONS_SECONDS),
        ContentType: 'image/jpeg'
      }

      //* Request S3 Generate a Secure URL for upload
      const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)

      //* Return S3 generated Secure URL
      return {
        secureUploadURL: uploadURL
      }

    },

    uploadSurfHackPicture: async (parent, { pictureKey }) => {

      console.log("\n   \x1b[33m S3 Secure Upload Requested for Surf Hack Picture (" + pictureKey + ")\x1b[0m");

      //* Define S3 Params for URL Request
      const s3Params = {
        Bucket: process.env.S3_SURFHACKS_BUCKET,
        Key: pictureKey,
        Expires: parseInt(process.env.S3_URL_EXPIRATIONS_SECONDS),
        ContentType: 'image/jpeg'
      }

      let pictureURL = "https://" + process.env.S3_SURFHACKS_BUCKET + ".s3." + process.env.S3_BUCKET_REGION + ".amazonaws.com/" + pictureKey

      //* Request S3 Generate a Secure URL for upload
      const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)

      console.log("SURF HACK Upload URL: " + uploadURL)


      //* Return S3 generated Secure URL
      return {
        secureUploadURL: uploadURL,
        postedURL: pictureURL
      }

    },

     uploadEventPicture: async (parent, { pictureKey }) => {

      console.log("\n   \x1b[33m S3 Secure Upload Requested for Event Picture (" + pictureKey + ")\x1b[0m");

      //* Define S3 Params for URL Request
      const s3Params = {
        Bucket: process.env.S3_EVENTS_BUCKET,
        Key: pictureKey,
        Expires: parseInt(process.env.S3_URL_EXPIRATIONS_SECONDS),
        ContentType: 'image/jpeg'
      }

      let pictureURL = "https://" + process.env.S3_EVENTS_BUCKET + ".s3." + process.env.S3_BUCKET_REGION + ".amazonaws.com/" + pictureKey

      //* Request S3 Generate a Secure URL for upload
      const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)

      console.log("EVENT Upload URL: " + uploadURL)


      //* Return S3 generated Secure URL
      return {
        secureUploadURL: uploadURL,
        postedURL: pictureURL
      }

    },

    uploadUserDefaultProfilePicture: async (parent, { userID }) => {
    
      //* Generate File Name based off UserID
      const fileKey = userID + ".jpg";

      //* Create FULL path to load default picture
      let defaultProfilePicturePath = path.join(path.dirname(require.main.filename),"/assets/Default_Profile.jpg");

      //* Replace backslash(s) in path to forwardslash(s)
      defaultProfilePicturePath = defaultProfilePicturePath.replace(/\\/g, '/');

      //* Load Default Profile Picture
      const defaultProfilePictureFile = fs.readFileSync(defaultProfilePicturePath);

      console.log("\n   \x1b[32mNew Account (" + userID +") Has Been Created!\x1b[0m");
      console.log("   \x1b[33mUploading Default Profile Picture as (" + fileKey + ")\x1b[0m");

      const s3Params = {
        Bucket: process.env.S3_USER_PROFILE_BUCKET,
        Key: fileKey,
        Body: defaultProfilePictureFile
      }

      await s3.upload(s3Params, function(err, data) {
      if (err) {
          throw err;
      }
      console.log("\x1b[32m   File " + fileKey + " successfully uploaded.\n   \x1b[33m" + data.Location + "\x1b[0m");
      return data.Location;
      });

    //  console.log(uploadURL);
      return "Upload Successfully!";
    },

    getSurfHack: async (parent, { surfHackID }) => {
      
      // console.log("surfHackID: " + surfHackID)
      
      const surfHack = await SurfHack.findOne({_id: surfHackID})

      return surfHack;
    },

    getSurfHackList: async () => {
      
      // console.log("surfHackID: " + surfHackID)
      
      const surfHackList = await SurfHack.find()

      return surfHackList;
    },

    getShaperList: async () => {

      const shaperList = await Shaper.find()

      console.log("   \x1b[33mShaper List Requested (" + shaperList.length + ")\x1b[0m")

      return shaperList;
    },

    databaseCount: async () => {

      const UserList = await UserMongo.find();
      const EventList = await EventMongo.find();
      const SurfSessionList = await SurfSessionMongo.find();
      const SurfHackList = await SurfHack.find();
      const SahperList = await Shaper.find();


      return {
        userCount: UserList.length,
        surfSessionCount: EventList.length,
        eventCount: SurfSessionList.length,
        surfHacksCount: SurfHackList.length,
        shaperListCount: SahperList.length,
      }
    }
  },

  Mutation: {
    createUser: async (parent, { memberEmail, password, clubPassword, memberFirstName, memberLastName }) => {

      console.log("\n\x1b[33mCreate New User (MongoDB)\x1b[0m\n\x1b[0m\n   Password: \x1b[35m" + password + "\x1b[0m\n   Club Password: \x1b[35m" + clubPassword + "\x1b[0m\n   Email: " + memberEmail + "\x1b[0m\n   Name: " + memberFirstName + " " + memberLastName);

      // let registerDateLocal = new Date();
      // let utcOffset = registerDateLocal.getTimezoneOffset();
      // let registerDateUTC = new Date(registerDateLocal.getTime() + utcOffset * 60000);
      // let registerDate = registerDateLocal;
      let registerDate = new Date();

      // console.log("Date Local = " + registerDateLocal);
      // console.log("UTC Offset = " + utcOffset);
      // console.log("Date UTC = " + registerDateUTC);
      // console.log(registerDate.getTimezoneOffset())

      // let registerDate = new Date();

      //* Request Database create a new "User"
      const user = await UserMongo.create({ memberEmail, password, clubPassword, memberFirstName, memberLastName, registerDate });

      //TODO: Enable way to print this when it fails...
      //console.log("\x1b[35mAccount Creation Failed: Email already associated with an account \x1b[0m");


      // console.log(user)
      //* Sign/Generate JWT Token
      const token = signToken(user);

      console.log("\x1b[32mAccount Creation Successful\x1b[0m");

      //* Return Token to User
      return { token };

    },

    login: async (parent, { memberEmail, password }) => {

      var loginValid = false;

      console.log("\n\x1b[33mLogin Request\x1b[0m\n   Email: \x1b[33m" + memberEmail + "\x1b[0m\n   Password: \x1b[35m" + password + "\x1b[0m")

      //* Query Database for user based off provided "email"
      const user = await UserMongo.findOne({ memberEmail });

      // console.log("USER = " + user)

      //* Validate User Exists
      if (user == null) {
        // throw new AuthenticationError('No profile with this email found!');
        console.log('   \x1b[35mEmail Not Found!\x1b[0m');
        console.log("   \x1b[35mLogin Failed!\x1b[0m")

        const token = "INVALID LOGIN"
        return { token };
      }
      else {

        //* Validate Password via "isCorrectPassword" method
        const correctPw = await user.isCorrectPassword(password);

        //* Error for incorrect password
        if (!correctPw) {
          console.log("\x1b[35mLogin Failed\x1b[0m")
          loginValid = false;
          // throw new AuthenticationError('Incorrect password!');
        }

        if(correctPw)
        {
          console.log("\x1b[32m   Login Successful\x1b[0m\n");
          loginValid = true;
        }
        
        if(loginValid){
          //* Return Signed Token to User
          const token = signToken(user);

          return { token };
        }
        else {
          const token = "INVALID LOGIN"
          return { token };
        }

      }
    },

    adminLogin: async (parent, { adminEmail, adminPassword }) => {

      //* Logic to check for admin status

      // console.log("\n\x1b[36m============= ADMIN ENV EMAIL =============\x1b[0m")
      // console.log(process.env.ADMIN_ACCOUNT)
      // console.log(adminPassword)

      let admin = false

      if (process.env.ADMIN_ACCOUNT == adminEmail) {
        console.log("\n\x1b[36m========================================\x1b[0m")
        console.log("=\x1b[31m    WARNING ADMIN LOG IN DETECTED!\x1b[0m    =")
        console.log("\x1b[36m========================================\x1b[0m")
        admin = true
      }
      else {
        admin = false
      }

      adminToken = {
        adminEmail: adminEmail,
        adminValid: true
      }
      
      if(admin){

        //* Validate Admin Password
        if( adminPassword == process.env.ADMIN_ACCOUNT_PASSWORD) {

          //* Return Signed Token to User
          const token = signAdminToken(adminToken);
          return { token };

        }
        else {
          const token = "INVALID ADMIN PASSWORD"
          return { token };
        }

      }
      else {
        const token = "INVALID ADMIN LOGIN"
        return { token };
      }

    },

    updateEmail: async (parent, { memberEmail, _id }) => {

      //TODO: Confirm new email does not already exists in DB
      //TODO: Add Try/Catch logic to print failed update to console

      console.log("\n\x1b[33mUpdate User Email (MongoDB)\x1b[0m\n\x1b[0m\n   Email: \x1b[35m" + memberEmail + "\n\x1b[0m   ID: \x1b[35m" + _id);

      await UserMongo.updateOne({ _id: _id }, { $set: { memberEmail: memberEmail } })

      console.log("\x1b[32m   Email Update Successful\x1b[0m\n");

      //* Get updated user data from DB via Email
      const user = await UserMongo.findOne({ memberEmail });

      //* Return Signed Token to User
      const token = signToken(user);
      return { token };

    },

    updatePassword: async (parent, { password, _id }) => {

      console.log("\n\x1b[33mUpdate User Password (MongoDB)\x1b[0m\n\x1b[0m\n   Password: \x1b[35m" + password + "\n\x1b[0m   ID: \x1b[35m" + _id + "\x1b[0m");

      const user = await UserMongo.findOne({ _id });
      const hashword = await user.generateHash(password);


      //TODO: Add Try/Catch logic to print failed update to console
      await UserMongo.updateOne({ _id: _id }, { $set: { password: hashword } })

      console.log("\x1b[32m   Password Update Successful\x1b[0m\n");

      //* Get updated user data from DB via userID
      const updatedUser = await UserMongo.findOne({ _id });

      //* Return Signed Token to User
      const token = signToken(updatedUser);
      return { token };

    },

    updateName: async (parent, { memberFirstName, memberLastName, _id }) => {

      console.log("\n\x1b[33mUpdate User Name (MongoDB)\x1b[0m\n\x1b[0m\n  Name: \x1b[35m" + memberFirstName + " " + memberLastName + "\n\x1b[0m   ID: \x1b[35m" + _id);

      await UserMongo.updateOne({ _id: _id }, { $set: { memberFirstName: memberFirstName, memberLastName:memberLastName } })

      console.log("\x1b[32m   Name Update Successful\x1b[0m\n")

      //* Get updated user data from DB via userID
      const user = await UserMongo.findOne({ _id });

      //* Return Signed Token to User
      const token = signToken(user);
      return { token };

    },

    createEvent: async (parent, { eventName, eventSlogan, eventDate, eventLength, eventBody, eventPhotoURL, eventCurrent }) => {

      console.log("\n\x1b[33mCreate New Event (MongoDB)\x1b[0m\n\x1b[0m\n   Event Title: \x1b[35m" + eventName + "\x1b[0m\n   Event Date: \x1b[35m" + eventDate + "\x1b[0m\n   Event Length: " + eventLength + "\x1b[0m\n   Event Photo URL: " + eventPhotoURL);

      //* Request Database create a new "Event"
      const event = await EventMongo.create({ eventName, eventSlogan, eventDate, eventLength, eventBody, eventPhotoURL, eventCurrent });

      //TODO: Enable way to print this when it fails...
      //console.log("\x1b[35mEvent Creation Failed: \x1b[0m");

      console.log("\x1b[32mEvent Creation Successful\x1b[0m");
      // console.log(event)

      return event;
    },

    updateEvent: async (parent, { eventID, newEventName, newEventSlogan, newEventDate, newEventLength, newEventBody, newEventPhotoURL, newEventCurrent }) => {
    
      console.log("\x1b[33m UPDATE: Event [" + eventID + "]\x1b[0m\n")

      const eventUpdatedResponse = await EventMongo.updateOne({_id: eventID}, { $set: { eventName: newEventName, eventSlogan: newEventSlogan, eventDate: newEventDate, eventBody: newEventBody, eventPhotoURL: newEventPhotoURL, eventCurrent: newEventCurrent, eventLength: newEventLength } })

      //* Get updated surf hack from DB via hackID
      const eventUpdated = await EventMongo.findOne({ _id: eventID });

      return eventUpdated;
    
    },

    deleteEvent: async (parent, {eventID}) => {

      const eventDelete = await EventMongo.deleteOne({_id: eventID});

      console.log("\x1b[31m DELETE: Event [" + eventID + "]\x1b[0m\n")

      return "Event (" + eventID + ") was Deleted!"

    },

    createSurfSession: async (parent, { userID, sessionDate, sessionTime, sessionLocation, skyConditions, waveSize, tideLevel, tideDirection, sessionLength, surfboardShaper, surfboardModel, surfboardLengthFT, surfboardLengthIN, surfboardVolume, surfboardFinConfig, sessionNotes, sessionRating  }) => {

      const surfSession = await SurfSessionMongo.create({ userID, sessionDate, sessionTime, sessionLocation, skyConditions, waveSize, tideLevel, tideDirection, sessionLength, surfboardShaper, surfboardModel, surfboardLengthFT, surfboardLengthIN, surfboardVolume, surfboardFinConfig, sessionNotes, sessionRating });

      console.log("\x1b[32m CREATE: [" + surfSession._id + "] Surf Session\x1b[0m\n")

      return surfSession;
    },
    
    deleteSurfSession: async (parent, { sessionID }) => {

      const sessionDelete = await SurfSessionMongo.deleteOne({_id: sessionID});

      console.log("\x1b[31m DELETE: [" + sessionID + "] Surf Session\x1b[0m\n")

      return sessionID + " Surf Session Was Deleted Successfully!";
    },

    createSurfHack: async (parent, { hackTitle, hackBody, hackPhotoURL }) => {

      const surfHack = await SurfHack.create({hackTitle, hackBody, hackPhotoURL});
    
      console.log("\x1b[32m CREATE: Surf Hack (" + hackTitle + ")\x1b[0m\n")

      return surfHack;

    },

    createShaper: async (parent, {shaperName}) => {

      const shaper = await Shaper.create({shaperName});

      console.log("\x1b[32m CREATE: Shapper (" + shaperName + ")\x1b[0m\n")

      return shaper
    },

    deleteShaper: async (parent, {shaperID}) => {

      const deleteShaper = await Shaper.deleteOne({_id: shaperID})

      console.log("\x1b[31m DELETE: Shaper [" + shaperID + "]\x1b[0m\n")

      return "Shaper (" + shaperID + ") Deleted!";

    },

    deleteSurfHack: async (parent, {hackID}) => {

      const surfHackDelete = await SurfHack.deleteOne({_id: hackID});

      console.log("\x1b[31m DELETE: Surf Hack [" + hackID + "]\x1b[0m\n")

      return "Surf Hack (" + hackID + ") Deleted!"

    },

    updateSurfHack: async (parent, { hackID, newHackTitle, newHackBody, newHackPhotoURL }) => {

      console.log("\x1b[33m UPDATE: Surf Hack [" + hackID + "]\x1b[0m\n")

      const surfHackUpdatedResponse = await SurfHack.updateOne({_id: hackID}, { $set: { hackTitle: newHackTitle, hackBody: newHackBody, hackPhotoURL: newHackPhotoURL, } })

      //* Get updated surf hack from DB via hackID
      const surfHackUpdated = await SurfHack.findOne({ _id: hackID });

      return surfHackUpdated;

    },
  },

};

module.exports = resolvers;