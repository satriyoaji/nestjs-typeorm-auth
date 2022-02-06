const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    PORT: process.env['APP_PORT'],
    DB: process.env['DB_URI'],
}
