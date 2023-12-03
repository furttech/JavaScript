const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models/");
const User = db.User;
const Role = db.Role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if(!token) {
    return res.status(403).send({message: "Token Not Found!"});
  }
  
  jwt.verify(token, config.secrete, (err, decoded) =>{
    if(err){
      return res.status(401).send({message: "Not Authorized!",});
    }
    req.userID = decoded.id;
    next();
  })
};

isAdmin = async (req, res, next) => {
  // query the database for a user by ID
  await User.findById(req.userID)
  .then(async(userData)=>{
    // query the database for Roles fetched from User collection
    await Role.find({ _id: {$in: userData.roles}})
    .then((roleData)=>{
      for(let i=0; i<roleData.length; i++){
        if( roleData[i].name == "admin"){
          next();
          return;
        }
      }
      res.status(403).send({message: "Admin Role Requires for Access!"});
      return;
    })
    .catch((err)=>{
      res.status(500).send({message: err});
      return;
    });
  })
  .catch((err)=>{
    res.status(500).send({message: err});
    return;
  });
};

isModerator = async (req, res, next) => {
  // query database for userID
  User.findById(req.userID)
  .then((userData)=>{
    // query database for role ids
    Role.find({ _id: {$is: userData.roles}})
    .then((roleData)=>{
      //check roles for moderator match.
      for(let i=0; i<roleData.length; i++){
        // check fetched user roles for moderator assignment
        if( roleData[i].name == "moderator"){
          next();
          return;
        }
      }
      res.status(403).send({message: "Moderator Role Requires for Access!"});
      return;
    })
    .catch((err)=>{
      res.status(500).send({message: err});
      return;
    });
  })
  .catch((err)=>{
    res.status(500).send({message: err});
    return;
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

module.exports = authJwt;