// import and configure .env file
const dotenv = require("dotenv");
dotenv.config({ path : "./config.env"});

const user = process.env.USER || "";
const pass = process.env.PASS || "";
const uri = process.env.URI || "";
const port = process.env.APPPORT || "";


module.exports = {
    LOGIN : user,
    PASS : pass,
    URI : uri,
    PORT : port,
};