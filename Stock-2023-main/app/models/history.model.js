const sql = require("./db");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs/dist/bcrypt");
const expireTime = "2h"; //token will expire in 2 hours
const fs = require("fs");

const History = function(history){
    this.user_id = history.user_id;
    this.cart_id = history.cart_id;
    this.equip_id = history.equip_id;
    this.amount = history.amount;
    this.status_id =history.status_id;
}

History.addToHistory=(addObj, result)=>{
          sql.query("INSERT INTO borrow SET ?",addObj,(err,res)=>{
            if(err){
              console.log("Query error: " + err);
              result(err, null);
              return;
            }
            sql.query(
              "DELETE FROM cart WHERE id = ?",
              [addObj.cart_id],
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
              }
          );
            result(null, {...addObj});
            console.log("History:", {...addObj});
            // sql.query(
            //     "DELETE FROM cart WHERE id = ?",
            //     [addObj.cart_id],
            //     (err, res) => {
            //       if (err) {
            //         console.log("Query error: " + err);
            //         result(err, null);
            //         return;
            //       }
            //       if (res.affectedRows == 0) {
            //           //this user id not found
            //           result({ kind: "not_found" }, null);
            //                   //Mistake return so sent more than one response
            //           return;
            //       }
            //     }
            // );
          });
}
History.getHistory_userId = (user_id,result) =>{
    sql.query(
      "SELECT borrow.id, borrow.cart_id, borrow.user_id,borrow.amount, level.status_name, equipment.equip_name FROM borrow INNER JOIN level ON borrow.status_id = level.id INNER JOIN equipment ON borrow.equip_id = equipment.id WHERE borrow.user_id = ?",
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
        console.log("Get History User Id: ", { user_id: user_id});
        result(null, { History: res});
      }
    );
  }

module.exports = History;