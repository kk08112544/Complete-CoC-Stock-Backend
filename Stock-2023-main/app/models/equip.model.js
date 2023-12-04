const sql = require("./db");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs/dist/bcrypt");
const expireTime = "2h"; //token will expire in 2 hours
const fs = require("fs");

const Equip = function(equip){
    this.equip_name = equip.equip_name;
    this.img_url=equip.img_url;
    this.amount=equip.amount;
    this.description=equip.description;
}

Equip.create = (equipObj, result)=>{
    sql.query("INSERT INTO equipment SET ?", equipObj, (err, res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        result(null, {id: res.insertId, ...equipObj});
        console.log("Created Equipment:", {id: res.insertId, ...equipObj});
    });
};

Equip.getAllRecords = (result)=>{
    sql.query("SELECT * FROM equipment", (err, res)=>{
        if(err){
            console.log("Query err: " + err);
            result(err,null);
            return;
        }
        result(null, res);
    });
};

Equip.getAllRecordsStock = (result) =>{
    sql.query("SELECT * FROM equipment WHERE amount != 0", (err, res)=>{
      if(err){
          console.log("Query err: " + err);
          result(err,null);
          return;
      }
      result(null, res);
    });
  }

const removeOldImage = (id, result) => {
    sql.query("SELECT * FROM equipment WHERE id=?", [id], (err, res)=>{
        if(err){
            console.log("error:" + err);
            result(err, null);
            return;
        }
        if(res.length){
            let filePath = __basedir + "/assets/" + res[0].img_url;
            try {
                if(fs.existsSync(filePath)){
                    fs.unlink(filePath, (e)=>{
                        if(e){
                            console.log("Error: " + e);
                            return;
                        }else{
                            console.log("File: " + res[0].img_url + " was removed");
                            return;
                        }
                    });
                }else {
                    console.log("File: " + res[0].img_url + " not found.")
                    return;
                }
            } catch (error) {
                console.log(error);
                return;
            }
        }
    });
};

Equip.updateEquip = (id, data, result) => {
    // Check if img_url is provided, otherwise, it won't be updated
    if (data.img_url) {
        removeOldImage(id);
    }

    const updateFields = ['equip_name', 'amount', 'description'];
    const updateValues = [data.equip_name, data.amount, data.description];

    // Include img_url in updateFields and updateValues if provided
    if (data.img_url) {
        updateFields.push('img_url');
        updateValues.push(data.img_url);
    }

    sql.query(
        `UPDATE equipment SET ${updateFields.map(field => `${field}=?`).join(',')} WHERE id=?`, 
        [...updateValues, id],
        (err, res) => {
            if (err) {
                console.log("Error: " + err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                // No record updated
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Update Equipment: " + { id: id, ...data });
            result(null, { id: id, ...data });
        }
    );
};

Equip.removeEquip = (id, result)=>{
    removeOldImage(id);
    sql.query("DELETE FROM equipment WHERE id=?", [id], (err, res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        if(res.affectedRows == 0){
            result({kind: "not_found"}, null);
            return;
        }
        console.log("Deleted equipment id: " + id);
        result(null, {id: id});
    } );
};

module.exports = Equip;