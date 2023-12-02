const Equip = require("../models/equip.model")
const bcrypt = require("bcryptjs");

const createNewEquip = (req, res)=>{
    if(!req.body.equip_name || !req.body.img_url || !req.body.amount || !req.body.description){
        res.status(400).send({message: "Content can not be empty."});
    }
    const salt = bcrypt.genSaltSync(10);
    const equipObj = new Equip({
        equip_name: req.body.equip_name,
        img_url: req.body.img_url,
        amount: req.body.amount,
        description:req.body.description
    });
    Equip.create(equipObj, (err, data)=>{
        if(err){
            res.status(500).send({message: err.message || "Some error occured while creating"});
        }else res.send(data);
    });
};

const getAllEquip = (req,res)=>{
    Equip.getAllRecords((err, data)=>{
        if(err){
            res.status(500).send({message: err.message || "Some error ocurred."});
        }else res.send(data);
    });
};


const updateEquipCtrl = (req, res)=>{
    if(!req.body.equip_name || !req.body.img_url || !req.body.amount || !req.body.description){
        res.status(400).send({message: "Content can not be empty."});
    }
    const data = {
        equip_name: req.body.equip_name,
        img_url: req.body.img_url,
        amount: req.body.amount,
        description:req.body.description
    };
    Equip.updateEquip(req.params.id, data, (err, result)=>{
        if(err){
            if(err.kind == "not_found"){
                res.status(401).send(
                    {message: "Not found equipment: " + req.params.id}
                    );
            }else {
                res.status(500).send(
                    {message: "Error update equipment: " + req.params.id}
                );
            }
        }else {
            res.send(result);
        }
    });
};

const getAllStock = (req,res)=>{
    Equip.getAllRecordsStock((err, data)=>{
        if(err){
            res.status(500).send({message: err.message || "Some error ocurred."});
        }else res.send(data);
    });
  };

const deleteEquip = (req, res)=>{
    // console.log("parameters: " + req.params.id + 
    // ", " + req.params.p1 + 
    // ", " + req.params.p2);
    Equip.removeEquip(req.params.id, (err, result)=>{
        if(err){
            if(err.kind == "not_found"){
                res.status(401).send(
                    {message: "Not found equipment: " + req.params.id}
                    );
            }
            else{
                res.status(500).send(
                    {message: "Error delete equipment: " + req.params.id}
                    );
            }
        }else{
            res.send(result);
        }
    });
};

module.exports = { 
    createNewEquip,
    getAllEquip, 
    updateEquipCtrl,
    deleteEquip,
    getAllStock
};
