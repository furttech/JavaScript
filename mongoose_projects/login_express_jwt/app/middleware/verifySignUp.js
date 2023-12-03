const db = require("../models");
const ROLES = db.ROLES;
const User = db.User;

checkDup = async (req, res, next) => {
    console.log("DATA LOG :: checkDup - ", req.body);
    await User.findOne({
        username: req.body.username
    })
    .then(async (data)=>{
        if(data){
            res.status(400).send({message: "Failed! Username is already in use."});
            return;
        }

        await User.findOne({
            email: req.body.email
        })
        .then((data)=>{
            if(data){
                res.status(400).send({message: "Failed! Email is already in use."});
            }
            next();
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

checkRolesExisted = (req, res, next) => {
    console.log("DATA LOG :: checkRoleExisted");
    if(req.body.roles){
        for(let i=0; i<req.body.roles.length; i++){
            if(!ROLES.includes(req.body.roles[i])){
                console.log("DATA LOG :: Checking Role - ",req.body.roles[i]);
                res.status(400).send({ message: `Failed! Roles ${req.body.roles[i]} does not exist!`});
                return;
            }
        }
    }
    next();
};

const verifySignUp = {
    checkDup,
    checkRolesExisted
};

module.exports = verifySignUp;