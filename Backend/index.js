//NgHTOJsMH8CYEJZY
require ("dotenv").config({
    path: "./.env"
});
require("colors");
const app = require("./src/app");
const { ConnectDB } = require("./src/db.config");
const port = process.env.PORT || 1234;

ConnectDB()
app.listen(port, ()=>{
    console.log(`the port is listening http://localhost:${port}`.bgBlue)
})

