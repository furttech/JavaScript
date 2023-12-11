// import and configure .env file
const dotenv = require("dotenv");
dotenv.config({ path : "./config.env"});

const user = process.env.REACT_APP_USER || "";
const pass = process.env.REACT_APP_PASS || "";
const uri = process.env.REACT_APP_URI || "";
const port = process.env.REACT_APP_APPPORT || "";


module.exports = {
    LOGIN : user,
    PASS : pass,
    URI : uri,
    PORT : port,
};