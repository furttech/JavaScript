exports.allAccess = (req, res, next) => {
    console.log("Route Accessed :: ALL");
    res.status(200).send("Public Access");
};

exports.userBoard = (req, res, next) => {
    console.log("Route Accessed :: USER");
    res.status(200).send("Access Granted : User Content");
};

exports.adminBoard = (req, res, next) => {
    console.log("Route Accessed :: ADMIN");
    res.status(200).send("Access Granted : Administration");
};

exports.moderatorBoard = (req, res, next) => {
    console.log("Route Accessed :: MOD");
    res.status(200).send("Access Granted : Moderator");
};
