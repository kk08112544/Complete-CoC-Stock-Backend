const authJWT = require("../middleware/auth.jwt")
module.exports = (app) =>{
    const cart_controller = require('../controllers/cart.controller')
    var router = require('express').Router();
    router.get("/:user_id",authJWT,cart_controller.getCartUserId);
    router.delete("/deleteCart/:id", authJWT,cart_controller.deleteCartId);
    router.put("/updateCart/:id",authJWT,cart_controller.updateCartId);
    router.post("/addCart",authJWT,cart_controller.addToCart);
    app.use("/api/cart", router);
}