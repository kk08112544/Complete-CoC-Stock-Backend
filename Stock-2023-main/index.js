const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
global.__basedir = __dirname;
var corsOptions = {origin: "*"};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
    res.json({ message: "Welcome to the Manage Account API."});
});
require("./app/routes/user.routes")(app);
require("./app/routes/file.routes")(app);
require("./app/routes/cart.routes")(app);
require("./app/routes/history.routes")(app);
require("./app/routes/manage.routes")(app);
require("./app/routes/equip.routes")(app)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('http://localhost:3000')
});