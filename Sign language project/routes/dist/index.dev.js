"use strict";

var express = require('express');

var router = express.Router();

var User = require('../models/user');

var Contact = require('../models/contact');

var Admin = require('../models/admin');

var PythonShell = require('python-shell');

var _require = require('luxon'),
    DateTime = _require.DateTime;

var csv = require('csv-parser');

var fs = require('fs');

var path = require('path');

var axios = require('axios');

router.get('/', function (req, res, next) {
  return res.render('signup.ejs');
});
router.post('/', function (req, res, next) {
  console.log(req.body);
  var personInfo = req.body;

  if (!personInfo.email || !personInfo.firstname || !personInfo.lastname || !personInfo.mobileno || !personInfo.password || !personInfo.passwordConf) {
    res.send();
  } else {
    if (personInfo.password == personInfo.passwordConf) {
      User.findOne({
        email: personInfo.email
      }, function (err, data) {
        if (!data) {
          var c;
          User.findOne({}, function (err, data) {
            if (data) {
              console.log("if");
              c = data.unique_id + 1;
            } else {
              c = 1;
            }

            var newPerson = new User({
              unique_id: c,
              email: personInfo.email,
              firstname: personInfo.firstname,
              lastname: personInfo.lastname,
              mobileno: personInfo.mobileno,
              password: personInfo.password,
              passwordConf: personInfo.passwordConf
            });
            newPerson.save(function (err, Person) {
              if (err) console.log(err);else console.log('Success');
            });
          }).sort({
            _id: -1
          }).limit(1);
          res.redirect('/login');
        } else {
          res.send({
            "Success": "Email is already used."
          });
        }
      });
    } else {
      res.send({
        "Success": "password is not matched"
      });
    }
  }
});
router.get('/login', function (req, res, next) {
  return res.render('login.ejs');
});
router.post('/login', function (req, res, next) {
  //console.log(req.body);
  User.findOne({
    email: req.body.email
  }, function (err, data) {
    if (data) {
      if (data.password == req.body.password) {
        //console.log("Done Login");
        req.session.userId = data.unique_id; //console.log(req.session.userId);

        res.redirect('/data');
      } else {
        res.send({
          "Success": "Wrong password!"
        });
      }
    } else {
      res.send({
        "Success": "This Email Is not regestered!"
      });
    }
  });
});
router.get('/profile', function (req, res, next) {
  console.log("Dashboard");
  User.findOne({
    unique_id: req.session.userId
  }, function (err, data) {
    console.log("data");
    console.log(data);

    if (!data) {
      res.redirect('/');
    } else {
      //console.log("found");
      return res.render('data.ejs', {
        "name": data.username,
        "email": data.email
      });
    }
  });
});
router.get('/logout', function (req, res, next) {
  console.log("logout");

  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
});
router.get('/forgetpass', function (req, res, next) {
  res.render("forget.ejs");
});
router.post('/forgetpass', function (req, res, next) {
  //console.log('req.body');
  //console.log(req.body);
  User.findOne({
    email: req.body.email
  }, function (err, data) {
    console.log(data);

    if (!data) {
      res.send({
        "Success": "This Email Is not regestered!"
      });
    } else {
      // res.send({"Success":"Success!"});
      if (req.body.password == req.body.passwordConf) {
        data.password = req.body.password;
        data.passwordConf = req.body.passwordConf;
        data.save(function (err, Person) {
          if (err) console.log(err);else console.log('Success');
          res.send({
            "Success": "Password changed!"
          });
        });
      } else {
        res.send({
          "Success": "Password does not matched! Both Password should be same."
        });
      }
    }
  });
});
router.post('/submit-query', function _callee(req, res) {
  var _req$body, name, email, subject, message, newContact;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Extract form data from request
          _req$body = req.body, name = _req$body.name, email = _req$body.email, subject = _req$body.subject, message = _req$body.message;
          _context.prev = 1;
          // Create new contact document
          newContact = new Contact({
            name: name,
            email: email,
            subject: subject,
            message: message
          }); // Save contact document to database

          _context.next = 5;
          return regeneratorRuntime.awrap(newContact.save());

        case 5:
          // Respond with success message
          res.render('contact', {
            successMessage: 'Message sent successfully'
          });
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          // Respond with error message if there's an error
          console.error(_context.t0);
          res.status(500).json({
            message: 'An error occurred'
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
router.get('/data', function (req, res) {
  User.findOne({
    unique_id: req.session.userId
  }, function (err, data) {
    console.log("data");
    console.log(data);

    if (!data) {
      res.redirect('/data');
    } else {
      //console.log("found");
      return res.render('data.ejs', {
        "name": data.username,
        "email": data.email
      });
    }
  });
});
router.get('/tutorial', function (req, res) {
  // Assuming tutorial.ejs is located in the views directory
  res.render('tutorial.ejs');
});
router.get('/practise', function (req, res) {
  // Assuming tutorial.ejs is located in the views directory
  res.render('practise.ejs');
});
router.get('/signify-chat', function (req, res) {
  // Assuming tutorial.ejs is located in the views directory
  res.render('signify-chat.ejs');
});
router.get('/about', function (req, res) {
  // Assuming tutorial.ejs is located in the views directory
  res.render('about.ejs');
});
router.get('/contact', function (req, res) {
  // Assuming tutorial.ejs is located in the views directory
  res.render('contact.ejs');
});
router.get('/admin', function (req, res) {
  // Assuming tutorial.ejs is located in the views directory
  res.render('admin.ejs');
});
router.get('/feedback', function (req, res) {
  // Assuming tutorial.ejs is located in the views directory
  res.render('feedback.ejs');
});
router.post('/admin', function _callee2(req, res) {
  var _req$body2, email, password, admin;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password; // Check if admin exists in the database

          _context2.next = 3;
          return regeneratorRuntime.awrap(Admin.findOne({
            email: email,
            password: password
          }));

        case 3:
          admin = _context2.sent;

          if (admin) {
            res.redirect('');
          } else {
            res.status(401).json({
              Success: 'Invalid credentials'
            });
          }

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.get('/feedback', function (req, res) {
  Contact.find({}).then(function (feedbackData) {
    res.render('feedback', {
      feedbackData: feedbackData
    });
  })["catch"](function (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).send('Internal Server Error');
  });
});
module.exports = router;