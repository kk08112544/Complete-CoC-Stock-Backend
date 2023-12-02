const authJWT = require("../middleware/auth.jwt")
module.exports = (app) =>{
    const history_controller = require('../controllers/history.controller')
    var router = require('express').Router();
    router.get("/:user_id",authJWT,history_controller.getHistoryUserId);
    router.post("/addHistory",authJWT,history_controller.addHistory);
    app.use("/api/history", router);
}