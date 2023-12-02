const authJwt = require("../middleware/auth.jwt");
module.exports = (app)=>{
    const equip_controller = require("../controllers/equip.controller");
    var router = require("express").Router();
    router.post("/addEquip", equip_controller.createNewEquip);
    router.get("/", authJwt, equip_controller.getAllEquip);
    router.get("/stock",authJwt,equip_controller.getAllStock);
    router.put("/updateEquip/:id", authJwt, equip_controller.updateEquipCtrl);
    router.delete("/deleteEquip/:id", authJwt, equip_controller.deleteEquip);
    app.use("/api/equipment", router);
};