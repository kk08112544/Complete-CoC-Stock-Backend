const authJWT = require("../middleware/auth.jwt")
module.exports = (app) =>{
    const manage_controller = require('../controllers/manage.controller')
    var router = require('express').Router();
    router.get("/:id",authJWT,manage_controller.getBorrowId);
    router.get("/", authJWT,manage_controller.getAllBorrow);
    router.put("/update/:id",authJWT,manage_controller.updateStatusId);
    app.use("/api/management", router);
}