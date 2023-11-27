const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(){

    // set response header values
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // api fetch for Public access
    app.get("api/test/all", controller.allAccess);

    // api fetch for User Content
    app.get("api/test/user", [authJwt.verifyToken], controller.userBoard);

    // api fetch for moderator content
    app.get("/api/test/mod", [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);

    // api fetch for admin pannel
    app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
};