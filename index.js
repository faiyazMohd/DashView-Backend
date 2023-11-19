require("dotenv").config();
const connectToMongo = require("./db");
connectToMongo();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 6010; 

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/", require("./routes/data"));
app.listen(port, () => {

  console.log(`EndureFit Backend listening at http://localhost:${port}`);
});
