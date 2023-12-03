const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.User;
const Role = db.Role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

// TODO: make sure to salt the password

exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  // save user data using POST request data fields stored in user
  await user.save()
  .then(
    async (data)=>{
 
    // check request body for roles array 
    if(req.body.roles){
      
      // Check to see if the role exists
      await Role.find({
         name: {$in: req.body.roles}
      })
      .then(
        async (data)=>{
          // map user role
          user.roles = data.map(role => role._id);
          // save mapped roles to database
          await user.save()
          .then((data)=>{
            // on success send a response
            res.send({message: "User was registered Successfully!"})
          })
          .catch((err)=>{
            // log error to console and send response with err
            console.log("User.save - (Role Map) Error ::", err);
            res.status(500).send({message: err});
          });
        }
      )
      .catch((err)=>{
        // log error to console and send response with err
        console.log("User.save Error ::", err);
        res.status(500).send({message: err});
      });
    }else{

      // check for user role
      await Role.findOne({
          name: "user"
      })
      .then(
        async (data)=>{
        // create and save user role
        user.roles = [data._id];
        
        // save the new roles to database
        await user.save()
        .then((data)=>{
          // on success send a response
          res.send({message: "User was registered Successfully!"})
        })
        .catch((err)=>{
          // log error to console and send response with err
          console.log("User.save Error ::", err);
          res.status(500).send({message: err});
        });

      })
      .catch((err)=>{
        // log error to console and send response with err
        console.log("User.save Error ::", err);
        res.status(500).send({message: err});
        return;
      });
    }
  })
  .catch((err)=>{ 
    // log error to console and send response with err
    console.log("User.save Error ::", err);
    res.status(500).send({message: err});
  });
};

exports.signin = async (req, res) => {
  
  console.log(req.body);
  // query database for user
  await User.findOne({
    username: req.body.username
  })
  .populate("roles", "-__v")
  .then((user)=>{
    // check to verify the user exists
    if(!user){
      return res.status(404).send({ message: "Signin Error :: User Not Found!"});
    }
    
    console.log(`Comparing Stored HASH : ${user.password} == ${req.body.password} using bcrypt`);
    // validate the submitted password
    let validPass = bcrypt.compareSync(  
      req.body.password,
      user.password
    );

    if(!validPass){
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      })
    }

    // generate jwt token object
    const token = jwt.sign(
      { id: user.id },
      config.secrete,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 85000, // Just under 24 hours
      }
    );
    
    /**  THE DIRTY WAY 
    // create empty positions array
    let positions = [];

    // iterate thru available roles and push them to positions array as uppercase
    for(let i=0; i<user.roles.length; i++){
      // Append all roles in format 'ROLE_{role_name->UPPERCASE}'
      positions.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    */ 

    // The Make tiktok stream happy way :) // The Clean Way
    const positions = user.roles.map(role => `ROLE_${role.name}.toUpperCase()`);

    // on creation of objects and positions array send response
    res.status(200).send({
      id: user._id,
      user: user.username,
      email: user.email,
      roles: positions,
      accessToken: token      
    });

  })
  .catch((err)=>{
    //log error to console and send response with err
    console.log(`Signin Error :: `, err)
    res.status(500).send({message: err});
    return;
    
  });
};

/* Test signin and sign up using curl using CMD from windows show below
curl -i -X POST -H "Content-Type:application/json" -d "{\"username\":\"furtrole2\",\"password\":\"pass\",\"email\":\"test2@test.com\",\"roles\":"[\"admin\"]"}" http://localhost:3300/api/auth/signup

curl -i -X POST -H "Content-Type:application/json" -d "{\"username\":\"furttech\",\"password\":\"pass\"}" http://localhost:3300/api/auth/signin
*/