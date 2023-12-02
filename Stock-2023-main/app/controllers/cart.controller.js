const Cart = require("../models/cart.model")
const bcrypt = require("bcryptjs");

const addToCart = (req,res)=>{
  if(!req.body.user_id || !req.body.equip_id || !req.body.amount ){
    res.status(400).send({message: "Content can not be empty."});
  }
  const addObj = new Cart({
    user_id:req.body.user_id,
    equip_id:req.body.equip_id,
    amount:req.body.amount
  })
  Cart.addCart(addObj ,(err,data)=>{
    if(err){
      res.status(500).send({message: err.message || "Some error occured while creating"});
    }else res.send(data);
  })
}




const getCartUserId = (req,res)=>{
  const user_id =req.params.user_id;
  Cart.getCartUser_Id(user_id,(err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(401).send({
          message: "Not found Cart User id: " + req.params.user_id,
        });
      } else {
        res.status(500).send({
          message: "Error get Cart User id: " + req.params.user_id,
        });
      }
    } else res.send(data);
  });
}

const updateCartId = (req,res) => {
  const id =req.params.id;
  if (!req.body.amount) {
    res.status(400).send({ message: "Content can not be empty." });
  }

    newAmount= req.body.amount;
    Cart.updateById(id, newAmount, (err, data) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(401).send({
            message: "Not found Cart id: " + req.params.id,
          });
        } else {
          res.status(500).send({
            message: "Error update Cart id: " + req.params.id,
          });
        }
      } else res.send(data);
    });
}

const  deleteCartId = (req,res)=>{
  const id =req.params.id;
  Cart.deleteCartById (id,(err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(401).send({
          message: "Not found Cart User id: " + req.params.id,
        });
      } else {
        res.status(500).send({
          message: "Error Delete Cart User id: " + req.params.id,
        });
      }
    } else res.send(data);
  });
}

module.exports = { 
    deleteCartId,
    getCartUserId,
    addToCart,
    updateCartId,
};