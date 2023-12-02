const sql = require("./db");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs/dist/bcrypt");
const expireTime = "2h"; //token will expire in 2 hours
const fs = require("fs");

const Cart = function(cart){
    this.user_id = cart.user_id;
    this.equip_id = cart.equip_id;
    this.amount = cart.amount;
}

Cart.addCart=(addObj, result)=>{
    sql.query("INSERT INTO cart SET ?", addObj, (err, res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        result(null, {id:res.insertId, ...addObj});
        console.log("Cart:", {id:res.insertid, ...addObj});
    });
}



Cart.getCartUser_Id = (user_id,result) =>{
    sql.query(
      "SELECT cart.id,cart.user_id,equipment.equip_name,cart.amount FROM cart INNER JOIN equipment ON cart.equip_id = equipment.id WHERE user_id=?",
      [user_id],
      (err, res) => {
        if (err) {
          console.log("Query error: " + err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          //this user id not found
          result({ kind: "not_found" }, null);
          //Mistake return so sent more than one response
          return;
        }
        console.log("Get Cart User Id: ", { user_id: user_id});
        result(null, { Cart: res});
      }
    );
  }

Cart.deleteCartById = (id,result)=>{
    sql.query(
        "DELETE FROM cart WHERE id = ?",
        [id],
        (err, res) => {
          if (err) {
            console.log("Query error: " + err);
            result(err, null);
            return;
          }
          if (res.affectedRows == 0) {
            //this user id not found
            result({ kind: "not_found" }, null);
            //Mistake return so sent more than one response
            return;
          }
          console.log("Delete Cart Id: ", { id: id});
          result(null, { id: id});
        }
      );
}

Cart.updateById = (id, newAmount, result)=>{
    sql.query('SELECT * FROM cart WHERE id=?',[id],(err,res)=>{
      if(err){
        console.log("Query error: " + err);
           result(err, null);
           return;
      }else{
        if(res[0].amount==newAmount){
          console.log("This Amount are Same new Amount");
          res[0].message="current amount and new amount are same";
          result(err,{Message:res[0].message});
        }else{
          sql.query('UPDATE cart SET amount=? WHERE id=?',[newAmount,id]
              ,(err,res)=>{
              if (err) {
                  console.log("Query error: " + err);
                  result(err, null);
                  return;
              }
              if (res.affectedRows == 0) {
                  result({ kind: "not_found" }, null);
                  return;
              }
              console.log("Updated Borrow Id: ", { id: id, Amount:newAmount });
              result(null, { id: id, Amount:newAmount });
          })
        }
      }
    })
}
module.exports = Cart;