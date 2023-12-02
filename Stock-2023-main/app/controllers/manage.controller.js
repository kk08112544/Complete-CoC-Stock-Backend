const bcrypt = require("bcryptjs");
const Manage = require("../models/manage.model");

const getAllBorrow = (req, res) => {
    Manage.getAllRecords((err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Some error occured while retriveing data.",
        });
      } else res.send(data);
    });
  };

const getBorrowId = (req,res) => {
    const id =req.params.id;
    Manage.getRecordsId(id,(err, data) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(401).send({
            message: "Not found Borrow id: " + req.params.id,
          });
        } else {
          res.status(500).send({
            message: "Error get Borrow id: " + req.params.id,
          });
        }
      } else res.send(data);
    });
}

const updateStatusId = (req,res) => {
  const id =req.params.id;
  if (!req.body.status_id) {
    res.status(400).send({ message: "Content can not be empty." });
  }

    newStatusId= req.body.status_id;
    Manage.updateById(id, newStatusId, (err, data) => {
      if (err) {
        if (err.kind == "not_found") {
          res.status(401).send({
            message: "Not found Borrow id: " + req.params.id,
          });
        } else {
          res.status(500).send({
            message: "Error update Borrow id: " + req.params.id,
          });
        }
      } else res.send(data);
    });
}

module.exports = {getAllBorrow, getBorrowId, updateStatusId}