const History = require("../models/history.model")
const bcrypt = require("bcryptjs");

const addHistory = (req,res)=>{
  if(!req.body.user_id || !req.body.cart_id ||!req.body.equip_id || !req.body.amount){
    res.status(400).send({message: "Content can not be empty."});
  }
  const addObj = new History({
    user_id:req.body.user_id,
    cart_id:req.body.cart_id,
    equip_id:req.body.equip_id,
    amount:req.body.amount,
    status_id:'1'
  })
  History.addToHistory(addObj ,(err,data)=>{
    if(err){
      res.status(500).send({message: err.message || "Some error occured while creating"});
    }else res.send(data);
  })
}

const getHistoryUserId = (req,res)=>{
  const user_id =req.params.user_id;
  History.getHistory_userId(user_id,(err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(401).send({
          message: "Not found History User id: " + req.params.user_id,
        });
      } else {
        res.status(500).send({
          message: "Error get History User id: " + req.params.user_id,
        });
      }
    } else res.send(data);
  });
}




module.exports = { 
    getHistoryUserId,
    addHistory
};