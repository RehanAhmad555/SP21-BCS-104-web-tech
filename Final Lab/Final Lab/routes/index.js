var express = require("express");
var router = express.Router();
var Product = require("../models/Product");
const Doctor = require('../models/doctors');
const User = require("../models/User");
const bcrypt = require("bcryptjs");
/* GET home page. */
router.get("/login", function (req, res, next) {
  return res.render("site/login");
});
router.post("/login", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("danger", "User with this email not present");
    return res.redirect("/login");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    req.session.user = user;
    req.flash("success", "Logged in Successfully");
    return res.redirect("/");
  } else {
    req.flash("danger", "Invalid Password");
    return res.redirect("/login");
  }
});
router.get("/register", function (req, res, next) {
  return res.render("site/register");
});
router.get("/logout", async (req, res) => {
  req.session.user = null;
  console.log("session clear");
  return res.redirect("/login");
});
router.post("/register", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "User with given email already registered");
    return res.redirect("/register");
  }
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();
  return res.redirect("/login");
});
router.get("/contact-us", function (req, res, next) {
  return res.render("site/contact", { layout: "layout" });
});

router.get("/", async function (req, res, next) {
  let products = await Product.find();
  return res.render("site/homepage", {
    pagetitle: "Awesome Products",
    products,
  });
});
router.get("/api/products", async (req, res) => {
  const {page = 1, pageSize = 5} = req.query;
  const skip = (page-1)*pageSize
  try {
    const products = await Product.find().skip(skip).limit(pageSize);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/calculator', (req, res) => {
  res.render('Calculator', { results: req.session.results || [] });
});

router.post('/calculate', (req, res) => {
  const operand1 = parseFloat(req.body.operand1);
  const operand2 = parseFloat(req.body.operand2);
  const operation = req.body.operation;
  let result;

  switch (operation) {
    case '+':
      result = operand1 + operand2;
      break;
    case '-':
      result = operand1 - operand2;
      break;
    case '*':
      result = operand1 * operand2;
      break;
    case '/':
      result = operand2 !== 0 ? operand1 / operand2 : 'Infinity';
      break;
    default:
      result = 'Invalid operation';
  }

  if (!req.session.results) {
    req.session.results = [];
  }

  req.session.results.push({
    operand1: operand1,
    operation: operation,
    operand2: operand2,
    result: result
  });
  res.redirect('/calculator');
});


module.exports = router;
