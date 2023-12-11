express = require("express");
const cors = require("cors");

const app = express();
const db = require("./app/models");
const Role = db.Role;

////////* MongoDb Connection *////////
const mongo = require("./app/config/db.config.js");

//"mongodb://127.0.0.1:27017/posts";
db.mongoose.connect( mongo.URI,{
  dbName: 'posts',
  authSource: 'admin',
  user: mongo.LOGIN,
  pass: mongo.PASS

}).then((ans) => {

  // log a message to indicate success (dev only)
  console.log("Successfully connect to MongoDb.");
  
  // initialize mongodb database
  init();

}).catch(err => {

  // send error to log console
  console.error("Connection Error :: ", err);
 
  // exit on failure
  process.exit();

});

////////* App Settings *//////////////

const corOptions = {
    origin: "http://localhost:3000"
};

// set cores options
app.use(cors(corOptions));

// set parse content-type for requests
app.use(express.json());

// set parse content-type for requests
app.use(express.urlencoded({ extended: true }));

/////////* Routes Declaration *///////////

// routes for authorized domains
require('./app/routes/auth.routes')(app);

// routes for user domains
require('./app/routes/user.routes')(app);

///////////* Enable APP and Listen */////////////

// set port, start listing for front end requests
app.listen(mongo.PORT, () => {
  console.log(`Server is Running on PORT ${mongo.PORT}`);
});

///////////* Function Declarations */////////////

/*
 This function is responsible for initializing the database
 by providing schemas outlined in /models/*.routes.js files

 Three different user roles are designated for allowing 
 access control thorough out the application 
*/
async function init(){

  await Role.estimatedDocumentCount()
  .then(async (ans)=>{
    var count = ans;
    console.log("COUNT::", ans);
    if (count === 0){
      
      const userRole = new Role(
        {
          name: "user"
        }
      )

      const modRole = new Role(
        {
          name: "moderator"
        }
      )

      const userAdmin = new Role(
        {
          name: "admin"
        }
      )

      // role creation for user
      await userRole.save()
      .then((ans)=> {
        console.log("Added 'user' to roles collection!");
      })
      .catch((err) => {
        if(err){
          console.log("error:", err);
        }
      });

      // role creation for moderator
      await modRole.save()
      .then((ans)=>{
        console.log("Added 'moderator' to roles collection!");
      })  
      .catch((err) => {
        if(err){
          console.log("error:", err);
        }
      });

      // role creation for admin
      await userAdmin.save()
      .then((ans)=>{
        console.log("Added 'admin' to roles collection!");
      })      
      .catch((err) => {
        if(err){
          console.log("error:", err);
        }
      });
    }
  })
  .catch((err) => {

    // send error to log console
    console.error("Connection Error :: ", err);
   
    // exit on failure
    process.exit();
  
  });

  
  
}