const mongoose = require("mongoose");
const { Schema } = mongoose;

const DataModel = new Schema();

module.exports = mongoose.model("Data", DataModel, "Data");
