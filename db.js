const mongoose = require("mongoose");
const mongoURI = process.env.DATABASE_ATLAS;
mongoose.set("strictQuery", false);

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then((res) => {
      console.log("Connection to MongoDb Atlas was Successfull");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectToMongo;