//global variables
var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();


//routes

router.get('/login', function(req, res) {
    res.render('loginForm');
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'Good job, you logged in. Welcome',
    failureRedirect: '/auth/login',
    failureFlash: 'try again, bruh.'
}));


router.get('/signup', function(req, res) {
    res.render('signupForm');
});


router.post('/signup', function(req, res, next) {
    db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            'firstname': req.body.firstName,
            'lastname': req.body.lastName,
            "password": req.body.password
        }
    }).spread(function(user, wasCreated) {
        if (wasCreated) {
            //good
            passport.authenticate('local', {
                successRedirect: '/profile',
                successFlash: 'Account created and logged in',
                failureRedirect: '/login',
                failureFlash: 'Unknown error occurred, please re-login'
            })(req, res, next);
        } else {
            //bad
            req.flash('error', 'email already exist. Please login');
            res.redirect('/auth/login');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/auth/signup');
    });
});


router.get('/logout', function(req, res) {
    req.logout();
    req.flash('succes, you logged out');
    res.redirect('/');
});





//exports
module.exports = router;
