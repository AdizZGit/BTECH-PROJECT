var express = require('express');
var router = express.Router();
var User = require('../models/user');
const Contact = require('../models/contact');
const Admin = require('../models/admin');
var PythonShell = require('python-shell');
const { DateTime } = require('luxon');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const contact = require('../models/contact');

router.get('/', function (req, res, next) {
	return res.render('signup.ejs');
});



router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.firstname || !personInfo.lastname || !personInfo.mobileno || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							firstname: personInfo.firstname,
							lastname: personInfo.lastname,
							mobileno: personInfo.mobileno,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.redirect('/login');
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.redirect('/data');
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/data', function (req, res, next) {
	
	console.log("Dashboard");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs',{"name":data.firstname,"email":data.email});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
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
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});
router.post('/submit-query', async (req, res) => {
    // Extract form data from request
    const { name, email, subject, message } = req.body;

    try {
        // Create new contact document
        const newContact = new Contact({
            name,
            email,
            subject,
            message
        });

        // Save contact document to database
        await newContact.save();

        // Respond with success message
        res.render('contact', { successMessage: 'Message sent successfully',name });
    } catch (error) {
        // Respond with error message if there's an error
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});



router.get('/tutorial', function (req, res, next) {
	
	
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('tutorial.ejs',{"name":data.firstname,"email":data.email});
		}
	});
});


router.get('/practise', function (req, res, next) {
	
	
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('practise.ejs',{"name":data.firstname,"email":data.email});
		}
	});
});


router.get('/signify-chat', function (req, res, next) {
	
	
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('signify-chat.ejs',{"name":data.firstname,"email":data.email});
		}
	});
});

router.get('/about', function (req, res, next) {
	
	
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('about.ejs',{"name":data.firstname,"email":data.email});
		}
	});
});



router.get('/contact', function (req, res, next) {
	
	
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('contact.ejs',{"name":data.firstname,"email":data.email});
		}
	});
});

router.get('/admin', function(req, res) {
    // Assuming tutorial.ejs is located in the views directory
    res.render('admin.ejs');
});


router.post('/admin', async (req, res) => {
    const { email, password } = req.body;

    // Check if admin exists in the database
    const admin = await Admin.findOne({ email, password });

    if (admin) {
		res.redirect('/dashboard');
    } else {
        res.status(401).json({ Success: 'Invalid credentials' });
    }
});
router.get('/dashboard', async (req, res) => {
    try {
        // Fetch contact data from MongoDB
        const contacts = await Contact.find();

        // Render dashboard template and pass the contacts data to it
        res.render('dashboard', { contacts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;