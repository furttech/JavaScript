const config = require("./config/auth.config.js");
const db = require("../models");
const User = db.user;
const Roles = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

// TODO: make sure to salt the password

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save(
    (err, user) => {
      // handle error conditions
      if(err){
        res.status(500).send({message: err});
        return;
      }

      // map and save user role
      if(req.body.roles){

        // Check to see if the roles is registered or exists
        Roles.find(
          {
            name: { $in: req.body.roles}
          },
          (err, roles) => {
            if(err){
              res.status(500).send({message: err});
              return;
            }

            // map user role
            user.roles = roles.map(role => role._id);
            
            // saved newly mapped roles to collection
            user.save( err => {
              // check for error on role save
              if(err){
                // send error response
                res.status(500).send({message: err});
                return;
              }
            
              // on success send a response
              res.send({message: "User was registered Successfully!"})
            });
          }
        );

      }else{
        // look for standard user role in collection
        Role.findOne(
          {
            name: "user"
          },
          (err, role) => {
            
            // handle findOne error
            if(err){
              res.status(500).send({message: err});
              return;
            }

            // create and save user role
            user.roles = [role._id];
            user.save( err => {

              // check for error on save
              if(err){
                res.status(500).send({message: err});
              }

              res.send({ message: "User Registration Success!"});
            });
          }
        );
      }
    }
  );
};

exports.signin = (res, req) => {
  
  // query database for user
  User.findOne({
    username: req.body.username
  })
  .populate("roles", "-__v")
  .exec((err, user) => {

    // check for exec errors
    if(err){
      res.status(500).send({message: err});
      return;
    }

    // check to verify the user exists
    if(!user){
      return res.status(404).send({ message: "User Not Found!"});
    }

    // validate password
    let validPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    // check validation
    if(!validPassword){
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
  });
};
