//* Event Seeding File
//*

const mongoose = require('mongoose');
const EventMongo = require('../../models/EventMongo');


 const EventsSeed = [

  { 
    eventName: "Solid Surfboard's Demo Day",
    eventSlogan: "July 8th from 8am - 11am",  
    eventDate: "7-8-23",
    eventBody: `<div style="text-align: center;">
                  <p style="text-align: center; margin-top: 15px; padding: 0px 20px 0px 20px;">
                This Saturday the Solid Surfboards crew will be at the Board Club with a wide selection of models for members to try out from 8-11am. Donuts will be here to fuel you up, and with fun waves in the water, you won't want to miss out on this opportunity.
                  </p>
                  <div style="text-align: center; margin-top: 30px;">
                    🤙	See ya Saturday! 🤙	
                  </div>
                </div>`,
    eventPhotoURL: "https://theboardclubevents.s3.us-west-1.amazonaws.com/Solid_Surf_Demo_Day_7-8-23.jpg",
    eventLength: "3",
    eventCurrent: false
  },
  { 
    eventName: "STAB in the Dark at The Board Club",
    eventSlogan: "Win Italo Ferreira's Surfboard!",  
    eventDate: "5-27-23",
    eventBody: `<div style="text-align: center;">
                  <div style="text-align: center; padding: 0px 20px 0px 20px;">
                    <b>Saturday, May 27th</b>
                  </div>
                  <div style="text-align: center; padding: 0px 20px 0px 20px;">
                    <b>7:00pm: Doors Open</b>
                  </div>
                  <div style="text-align: center; padding: 0px 20px 0px 20px;">
                    <b>8:30pm: Start Time</b>
                  </div>
                  <p style="text-align: center; margin-top: 15px; padding: 0px 20px 0px 20px;">
                    Don't miss this one! The Board Club has partnered with Billabong and STAB in the Dark to show their final episode featuring Italo Ferreira. For more information about STAB in the Dark, click <a href="https://stabmag.com/news/goofyfoot-brazilian-world-champion-stars-in-stabs-biggest-board-testing-franchise/">HERE</a>
                  </p>
                  <div style="text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;">
                    There will be giveaways for wetsuits, T-shirts, hats, and all kinds of awesome gear. But most importantly, Italo Ferreira's surfboards from the show will be here at the club for you to check out and one of them will be raffled off to a Board Club member in attendance! I'm serious, you can win Italo's board.
                  </div>
                  <div style="text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;">
                    Free food and beverages. All ages welcome. Bring your friends and family for an awesome night.
                  </div>
                </div>`,
    eventPhotoURL: "https://theboardclubevents.s3.us-west-1.amazonaws.com/Stab_In_The_Dark.jpg",
    eventLength: "3",
    eventCurrent: false
  },
  {  
    eventName: "Ben Did Go 8.0",
    eventSlogan: "Information Meeting",  
    eventDate: "5-25-23",
    eventBody: `<div style="text-align: center;">
                  <div style="text-align: center; margin-top: 15px; padding: 0px 20px 0px 20px;">
                    <a href="https://newportboardclub.us14.list-manage.com/track/click?u=0a25bcde99c269f206a4642b2&id=78855ba8b7&e=c2a2495e9d">Donate Here</a>
                  </div>
                  <p style="text-align: center; margin-top: 15px; padding: 0px 20px 0px 20px;">
                    Every year, 100+ prone paddlers endure the grueling 30-mile channel crossing from Catalina to the Newport Pier to raise funds for the Ben Carlson Memorial Scholarship Foundation.  This Foundation is in memory of Ben Carlson, the NB Lifeguard who drowned while rescuing his victim in powerful 8-10ft surf on July 6th, 2016.  The money raised from this paddle goes to underfunded lifeguard agencies around the world, four lifeguard scholarships, and an annual water safety summit in San Diego.
                  </p>
                  <div style="text-align: center; margin-top: 30px; padding: 0px 20px 0px 20px;">
                    I'd also like to recognize our amazing employee, Spencer Pirdy, who started this paddle and fundraiser 8 years ago.  The event has grown tremendously and this year he's expecting 100+ paddlers.  Well done Spencer!
                  </div>
                </div>`,
    eventPhotoURL: "https://theboardclubevents.s3.us-west-1.amazonaws.com/BenDidGo8p0.jpg",
    eventLength: "2",
    eventCurrent: false
  },
  {  
    eventName: "Summer Kickoff Art Fair",
    eventSlogan: "Support Your Local Artisans",  
    eventDate: "6-24-23",
    eventBody: `<div style="text-align: center;">
                  <p style="text-align: center; margin-top: 15px; padding: 0px 20px 0px 20px;">
                It's slowly starting to feel like Summer and everyone will be looking for fun things to do so we're hosting another Art Fair!  Come check out the different artwork, photography, jewelry, succulents and other cool stuff from your locals artisans.
                  </p>
                </div>`,
    eventPhotoURL: "https://theboardclubevents.s3.us-west-1.amazonaws.com/SummerArtFair.jpg",
    eventLength: "4",
    eventCurrent: true
  },
  {  
    eventName: "Surf Coaching with Spencer Pirdy",
    eventSlogan: "Surf Coaching",  
    eventDate: "Call To Schedule",
    eventBody: `                <div style="text-align: center;">
                  <p style="text-align: center; margin-top: 15px; padding: 0px 20px 0px 20px;">
                    This is for anyone looking to improve their surfing. Spencer helps surfers at all levels improve technique, increase wave count, improve paddling efficiency, overall fitness, and comfortability in the lineup.
                  </p>
                  <h3 style="text-align: center; margin-top: 30px;"><b>Basic Package: $60*</b></h3>
                  <ul>
                    <li>- 1 Hour In-Water Surf Session</li>
                    <li>- Post Surf Session: Video Review (Cam Rewind)</li>
                  </ul>
                  <h5 style="text-align: center; margin-top: 15px;">(* Active Member Pricing)</h5>
                  <h3 style="text-align: center; margin-top: 30px;"><b>Group Package: $40/Person</b></h3>
                  <ul>
                    <li>- 1 Hour In-Water Surf Session</li>
                    <li>- Post Surf Session: Video Review (Cam Rewind)</li>
                  </ul>
                  <div style="text-align: center; margin-top: 30px;">
                    <h5><b>Spencer Pirdy</b></h5>
                    <a href = "mailto:spirdy1@gmail.com">spirdy1@gmail.com</a>
                    <h5><a href="tel:9494249684">949-424-9684</a></h5>
                  </div>
                  <div>
                    <h4 style="text-align: center; margin-top: 15px;">IG:<a href="https://www.instagram.com/spencestagramin/">@spencestagramin</a> </h4>
                  </div>
                </div>`,
    eventPhotoURL: "https://theboardclubevents.s3.us-west-1.amazonaws.com/Spencer%2BPirdy.jpeg",
    eventLength: "2",
    eventCurrent: true
  },

 ];

 const seedEventDB = async () => {
  // console.log("seedEventDB Function Start!")
  await EventMongo.deleteMany({});
  await EventMongo.insertMany(EventsSeed);
 };

 module.exports = seedEventDB;

 //!========================= EOF =========================