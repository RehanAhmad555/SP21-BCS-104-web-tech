var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts");
var indexRouter = require("./routes/index");
var protectedRouter = require("./routes/protected");
var sessionAuth = require("./middlewares/sessionAuth");
var checkSessionAuth = require("./middlewares/checkSessionAuth");
var apiauth = require("./middlewares/apiauth");
var session = require("express-session");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
var config = require("config");
app.use(
  session({
    secret: config.get("sessionSecret"),
    cookie: { maxAge: 300000 },
    resave: true,
    saveUninitialized: true,
  })
);
// const { startCronJobs } = require("./croneJobs/index");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/public/products", require("./routes/api/public/products"));
app.use("/api/products", apiauth, require("./routes/api/products"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/", sessionAuth, indexRouter);
app.use("/my-account", sessionAuth, checkSessionAuth, protectedRouter);
app.use("/", sessionAuth, require("./routes/shop"));
app.get("/admin", async (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "build", "index.html"));
});
app.get("/admin/*", async (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "build", "index.html"));
});
app.use(express.static(path.join(__dirname, "admin", "build")));

app.get("/product", async (req, res) => {
  res.sendFile(path.join(__dirname, "views", "site", "products.ejs"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/api/doctors/:id', async (req, res) => {
  const doctorId = req.params.id;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/calculator', (req, res) => {
  res.render('Calculator', { results: req.session.results || [] });
});

app.post('/calculate', (req, res) => {
  const a1 = parseFloat(req.body.operand1);
  const a2 = parseFloat(req.body.operand2);
  const operation = req.body.operation;
  let result;
  switch (operation){
    case '+':
      result = a1+a2;
      break;
    case '-':
      result = a1-a2;
      break;
    case '*':
      result = a1*a2;
      break;
    case '/':
      result = a2 !== 0 ? a1 / a2 : 'Infinity';
      break;
    default:
      result = 'Invalid operation';
  }
  if (!req.session.results) {
    req.session.results = [];
  }
  req.session.results.push({
    Opr1: a1,
    operation: operation,
    Opr2: a2,
    result: result
  });
  res.redirect('/calculator');
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
// startCronJobs();
module.exports = app;
