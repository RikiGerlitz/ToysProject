
const express = require("express");
const { auth } = require("../middlewares/auth");
const { ToysModel, validateToy } = require("../models/toyModel")
const router = express.Router();

router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;

  try {
    let data = await ToysModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})


router.get("/search", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let queryS = req.query.s;
    let searchReg = new RegExp(queryS, "i")
    let data = await ToysModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

router.get("/category/:catname", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let category = req.params.catname;
    let searchReg = new RegExp(category, "i")
    let data = await ToysModel.find({ category: searchReg })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }

})



router.post("/", auth, async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = new ToysModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "we found an error, try again later", err })
  }
})


router.put("/:editId", auth, async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let editId = req.params.editId;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToysModel.updateOne({ _id: editId }, req.body)
    }
    else {
      data = await ToysModel.updateOne({ _id: editId, user_id: req.tokenData._id }, req.body)
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "we found an error, try again later", err })
  }
})




router.delete("/:delId", auth, async (req, res) => {
  try {
    let delId = req.params.delId;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToysModel.deleteOne({ _id: delId })
    }
    else {
      data = await ToysModel.deleteOne({ _id: delId, user_id: req.tokenData._id })
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "we found an error, try again later", err })
  }
})

router.get("/single/:id", async (req, res) => {

  try {
    let id = req.params.id;
    let data = await ToysModel.findById(id)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "we found an error, try again later", err })
  }

})


router.get("/prices", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {

    let min = req.query.min || 0;

    let max = req.query.max || Infinity;

    let data = await ToysModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data)
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "we found an error, try again later", err })
  }
})

module.exports = router;