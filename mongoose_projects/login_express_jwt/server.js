express = require("express");
const cors = require("cors");

const app = express();

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Role = db.role;

////////* MongoDb Connection *////////

db.mongoose.connect(
  `mongodb://${dbConfig.Host}:${dbConfig.PORT}/${dbConfig.DB}`,
  {useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Successfully connect to MongoDb.");
  init();
}).catch(err => {
  console.error("Connection Error", err);
  process.exit();
});

////////* App Settings *//////////////

const corOptions = {
    origin: "http://localhost:8001"
};

// set cores options
app.use(cors(corOptions));

// set parse content-type for requests
app.use(express.json());

// set parse content-type for requests
app.use(express.urlencoded({ extended: true }));

/////////* Routes Declaration *///////////

// simple route for root zone
app.get("/", (req, res) => {
  res.json({message: "Welcome to the Show!"});
});

// routes for authorized domains
require('./app/routes/auth.routes')(app);

// routes for user domains
require('./app/routes/user.routes')(app);

///////////* Enable APP and Listen */////////////

// set port, start listing for front end requests
const PORT = process.env.PORT | 8080;
app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});

///////////* Function Declarations */////////////

/*
 This function is responsible for initializing the database
 by providing schemas outlined in /models/*.routes.js files

 Three different user roles are designated for allowing 
 access control thorough out the application 
*/
function init(){
  Role.estimateDocumentCount( (err, count) => {
    if (!err && count === 0){
      
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
      userRole.save(err => {
        if(err){
          console.log("error:", err);
        }
        console.log("Added 'user' to roles collection!");
      });

      // role creation for moderator
      modRole.save(err => {
        if(err){
          console.log("error:", err);
        }
        console.log("Added 'moderator' to roles collection!");
      });

      // role creation for admin
      userAdmin.save(err => {
        if(err){
          console.log("error:", err);
        }
        console.log("Added 'admin' to roles collection!");
      });
    }
  });
}