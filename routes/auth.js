const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_KEY;

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name")
      .isLength({ min: 3 })
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("email", "Enter a valid email").isEmail().normalizeEmail(),
    body("password", "password must be atleast 4 character")
      .isLength({
        min: 4,
      })
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  async (req, res) => {
    let success = false;
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res
        .status(400)
        .json({ success, msg: "Invalid Inputs", errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        success = false;
        return res.status(400).json({
          success,
          msg: "Sorry a user with this email already exists",
        });
      }
      const passSalt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, passSalt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      console.log(user);
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, msg: "User Created Successfully", authToken });
    } catch (error) {
      success = false;
      console.log(error);
      res.status(500).send({ success, msg: "Internal server error" });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail().normalizeEmail(),
    body("password", "password cannot be blank")
      .exists()
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  async (req, res) => {
    let success = false;
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res
        .status(400)
        .json({ success, msg: "Invalid Inputs", errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          success,
          msg: "Please try to login with correct credentials",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          msg: "Please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, msg: "User LoggedIn Successfully", authToken });
    } catch (error) {
      success = false;
      console.log(error);
      res.status(500).send({ success, msg: "Internal server error" });
    }
  }
);

module.exports = router;
