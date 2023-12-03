const auth = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app){

    // set response header values
    app.use(function(req, res, next){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // api fetch for Public access
    app.get("/api/test/all",[controller.allAccess]);

    // api fetch for User Content
    app.get("/api/test/user",[auth.authJwt.verifyToken, controller.userBoard]);

    // api fetch for moderator content
    app.get("/api/test/mod",[auth.authJwt.verifyToken, auth.authJwt.isModerator, controller.moderatorBoard ]);

    // api fetch for admin panel
    app.get("/api/test/admin",[auth.authJwt.verifyToken, auth.authJwt.isAdmin, controller.adminBoard]);
}