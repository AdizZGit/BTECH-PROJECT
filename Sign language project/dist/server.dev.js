"use strict";

var express = require('express');

var env = require('dotenv').config();

var ejs = require('ejs');

var path = require('path');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

var _require = require('luxon'),
    DateTime = _require.DateTime;

var _require2 = require('child_process'),
    spawn = _require2.spawn;

mongoose.connect('mongodb://127.0.0.1:27017/SignForm', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {});
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));
app.use('/images', express["static"](path.join(__dirname, 'images')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](__dirname + '/views'));

var index = require('./routes/index');

app.use('/', index);
var PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:' + PORT);
});