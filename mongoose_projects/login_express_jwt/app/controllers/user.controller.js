exports.allAccess = (req, res) => {
    res.status(200).send("Public Access)");
};

exports.userBoard = (req, res) => {
    res.status(200).send("Access Granted : User Content");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Access Granted : Administration");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Access Granted : Moderator");
};
