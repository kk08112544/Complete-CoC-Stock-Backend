const authJwt = require("../middleware/auth.jwt");
module.exports = (app)=>{
    const user_controller = require("../controllers/user.controller");
    var router = require("express").Router();
    router.post("/signup", user_controller.createNewUser);
    router.post("/login", user_controller.login);
    router.get("/:us", user_controller.validUsername);
    app.use("/api/auth", router);
};