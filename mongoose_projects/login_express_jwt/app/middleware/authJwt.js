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

isAdmin = (req, res, next) => {
  User.findById(req.userID).exec((err, user) => {
    if(err){
      res.status(500).send({message: err});
      return;
    }

    Role.find(
      { _id: {$in: user.roles}},
      (err, roles) =>{
        if(err){
          res.status(500).send({message: err});
          return;
        }

        for(let i=0; i<roles.length; i++){
          if( roles[i].name == "admin"){
            next();
            return;
          }
        }
        res.status(403).send({message: "Admin Role Requires for Access!"});
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userID).exec((err, user) => {
    if(err){
      res.status(500).send({message: err});
      return;
    }

    Role.find(
      { _id: {$in: user.roles}},
      (err, roles) =>{
        if(err){
          res.status(500).send({message: err});
          return;
        }

        for(let i=0; i<roles.length; i++){
          if( roles[i].name == "moderator"){
            next();
            return;
          }
        }
        res.status(403).send({message: "Moderator Role Requires for Access!"});
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

module.exports = authJwt;