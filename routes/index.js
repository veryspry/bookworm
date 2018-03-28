var express = require('express');
var router = express.Router();
const User = require('../models/user');
// requirng a directory like this simply tells express to load the index.js file in the directory in question
const mid = require('../middleware');

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  if (! req.session.userId ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
        }
      });
});

// GET /logout
router.get('/logout', function(req, res, next) {
	if (req.session) {
		// delete session object
		req.session.destroy( (err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

// GET /login
router.get('/login', mid.loggedOut, (req, res, next) => {
	return res.render('login', {title: 'Login In'});
});

// POST /login
router.post('/login', (req, res, next) => {
	if (req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, function(error, user) {
			if ( error || !user ){
				var err = new Error('Wrong email or password');
				err.status = 401;
				return next(err);
			} else {
				req.session.userId = user._id;
				return res.redirect('/profile');
			}
		});
	} else {
		var err = new Error('Email and password required.')
		err.status = 401;
		return next(err);
	}

});

// GET /register
router.get('/register', mid.loggedOut, (req, res, next) => {
	return res.render('register', {title: 'Sign Up'});
});

// POST /register
router.post('/register', (req, res, next) => {
	if ( req.body.name &&
		 req.body.email &&
		 req.body.favoriteBook &&
		 req.body.password &&
		 req.body.confirmPassword ) {

			//confirm that passwords match
			if ( req.body.password != req.body.confirmPassword ) {
				var err = new Error ('Passwords do not match.');
				err.status = 400;
				return next(err);
			}

			// create object w/form input
			var userData = {
				email: req.body.email,
				name: req.body.name,
				favoriteBook: req.body.favoriteBook,
				password: req.body.password
			};
			
			// use schema's create method to insert document into mongo
			User.create(userData, (error, user) => {
				if (error) {
					return next(error);
				} else {
					req.session.userId = user._id;
					return res.redirect('/profile');
				}
			});

	} else {
		var err = new Error ('All fields required.');
		err.status = 400;
		return next(err);
	}
});

// GET /
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', (req, res, next) => {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', (req, res, next) => {
  return res.render('contact', { title: 'Contact' });
});



module.exports = router; 













