const User = require("../models/user.model")
const bcrypt = require("bcryptjs");

const createNewUser = (req, res)=>{
    if(!req.body.names || !req.body.lastname || !req.body.username || !req.body.password || !req.body.confirm_password ){
        res.status(400).send({message: "Content can not be empty."});
    }
    if(req.body.password==req.body.confirm_password){
        const salt = bcrypt.genSaltSync(10);
        const userObj = new User({
            names: req.body.names,
            lastname: req.body.lastname,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, salt),
            role_id: '2'
        });
        User.create(userObj, (err, data)=>{
            if(err){
                res.status(500).send({message: err.message || "Some error occured while creating"});
            }else res.send(data);
        });
    }else res.send('Password does not matches')
   
};

const login = (req, res)=>{
    if(!req.body.username || !req.body.password){
        res.status(400).send({message: "Content can not be empty."});
    }
    const acc = new User({
        username: req.body.username,
        password: req.body.password
    });
    User.loginModel(acc, (err, data)=>{
        if(err){
            if(err.kind == "not_found"){
                res.status(401).send({message: "Not found " + req.body.username});
            }
            else if(err.kind == "invalid_pass"){
                res.status(401).send({message: "Invalid Password"});
            }else{
                res.status(500).send({message: "Query error." });
            }
        }else res.send(data);
    });
};

const validUsername = (req, res) => {
    User.checkUsername(req.params.us, (err, data)=>{
        if(err) {
            if(err.kind == "not_found"){
                res.send({
                    message: "Not Found: " + req.params.us,
                    valid: true
                });
            }
            else {
                res.status(500).send({ 
                    message: "Error query: " + req.params.us
                });
            }
        }else{
            res.send({record: data, valid: false});
        }
    });
};

module.exports = { 
    createNewUser,
    validUsername,
    login
};