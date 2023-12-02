const sql = require("./db");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs/dist/bcrypt");
const expireTime = "2h"; //token will expire in 2 hours
const fs = require("fs");

const User = function(user){
    this.names = user.names;
    this.lastname = user.lastname;
    this.username = user.username;
    this.password = user.password;
    this.role_id = user.role_id;
}

User.create = (newUser,result)=>{
    sql.query("INSERT INTO users SET ?", newUser, (err, res)=>{
        if(err){
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        const token = jwt.sign({id: res.insertId}, scKey.secret, {expiresIn: expireTime});
        result(null, {id: res.insertId, ...newUser, accessToken: token});
        console.log("Created user:", {id: res.insertId, ...newUser, accessToken: token});
    });

}
User.loginModel = (account, result)=>{
    sql.query("SELECT * FROM users WHERE username = ?", 
    [account.username], (err, res)=>{
        if(err){
            console.log("err:" + err);
            result(err, null);
            return;
        }
        if(res.length){
            const validPassword = bcrypt.compareSync(account.password, res[0].password);
            if(validPassword){
                const token = jwt.sign({id: res.insertId}, scKey.secret, {expiresIn: expireTime});
                console.log("Login success. Token: " + token);
                res[0].accessToken = token;
                console.log(res);
                result(null, res[0]);
                return;
            }else{
                console.log("Password not match");
                result({kind: "invalid_pass"}, null);
                return;
            }
        }
        result({kind: "not_found"}, null);
    });
};

User.checkUsername = (username, result)=>{
    sql.query("SELECT * FROM users WHERE username='"+username+"'",(err,res)=>{
        if(err){
            console.log("Error: " + err);
            result(err, null);
            return;
        }
        if(res.length){
            console.log("Found username: " + res[0].username);
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found"}, null);
    });
};

module.exports = User;