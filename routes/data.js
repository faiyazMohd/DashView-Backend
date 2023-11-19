const express = require("express");
const router = express.Router();
const DataModel = require("../models/DataModel");
const fetchuser = require("../middleware/fetchuser");
router.get("/getData", fetchuser, [], async (req, res) => {
  let success = false;
  console.log(req.body);
  try {
    const data = await DataModel.find();
    success = true;
    res.json({ success, msg: "Data Retrieved Successfully", data: data });
  } catch (error) {
    success = false;
    res.status(500).send({ success, msg: "Internal server error" });
    console.log(error);
  }
});
module.exports = router;