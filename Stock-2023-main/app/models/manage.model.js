const sql = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const fs = require("fs");
const expireTime = "2h"; //token will expire in 2 hours


//Constructor
const Manage = function (manage) {
    this.id = manage.id;
    this.status_id = manage.status_id;
};

Manage.getAllRecords = (result) => {
    sql.query("SELECT borrow.id, borrow.cart_id, borrow.user_id, equipment.equip_name,borrow.amount, level.status_name FROM borrow INNER JOIN level ON borrow.status_id = level.id INNER JOIN equipment ON borrow.equip_id = equipment.id", 
    (err, res) => {
      if (err) {
        console.log("Query error: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    });
  };

Manage.getRecordsId = (id,result) =>{
    sql.query(
      "SELECT borrow.id, borrow.cart_id, borrow.user_id, equipment.equip_name,borrow.amount, level.status_name FROM borrow INNER JOIN level ON borrow.status_id = level.id INNER JOIN equipment ON borrow.equip_id = equipment.id WHERE id = ?",
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
        console.log("Get Borrow Id: ", { id: id});
        result(null, { Borrow: res});
      }
    );
  }


Manage.updateById = (id, newStatusId, result) =>{
  sql.query("SELECT * FROM borrow WHERE id=?",[id],(err,res)=>{
        if (err) {
          console.log("Query error: " + err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ kind: "not_found" }, null);
          return;
        }
        const current= res[0].status_id;
        let borrowAmount = res[0].amount;
        const equip_id=res[0].equip_id;
        if(current==newStatusId){
          console.log("Same Status");
          res[0].message="This Status are already Exits";
          result(err,{Message:res[0].message});
        }else{
          if(newStatusId=='3'){
               sql.query('UPDATE borrow SET status_id=? WHERE id=?',[newStatusId,id]
                ,(err,res)=>{
                if (err) {
                  console.log("Query error: " + err);
                  result(err, null);
                  return;
                }
                console.log("Updated Borrow Id: ", { id: id, ...newStatusId });
                result(null, { id: id, Status_id:newStatusId });
              })
          }else if(newStatusId=='2'){
            sql.query("SELECT * FROM equipment WHERE id=?",[equip_id],(err,res)=>{
              if(err){
                console.log("Query error: " + err);
                result(err, null);
                return;
              }
              let equipAmount = res[0].amount;
              let TotalAmount = equipAmount+borrowAmount;
              sql.query("UPDATE equipment SET amount = ? WHERE id = ?",[TotalAmount,equip_id],
              (err,res)=>{
                if(err){
                  console.log("Query error: " + err);
                  result(err, null);
                  return;
                }
                sql.query("UPDATE borrow SET status_id = ? WHERE id = ?",[newStatusId,id],(err,res)=>{
                  if(err){
                    console.log("Query error: " + err);
                    result(err, null);
                    return;
                  }
                  console.log("Update Borrow Id: ", { id: id,status_id:newStatusId});
                  result(null, { Borrow: res});
                })
              })
            })
          }
        }
  })
}

module.exports = Manage