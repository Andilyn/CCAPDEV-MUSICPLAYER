// import module `database` from `../models/db.js`
const db = require('../models/db.js');

// import module `User` from `../models/UserModel.js`
const User = require('../models/UserModel.js');

// defines an object which contains functions executed as callback
// when a client requests for `signup` paths in the server
const signupController = {

    // executed when the client sends an HTTP GET request `/signup`
    // as defined in `../routes/routes.js`
    getSignUp: function (req, res) {
        res.render('signup');
    },

    // executed when the client sends an HTTP POST request `/signup`
    // as defined in `../routes/routes.js`
    postSignUp: function (req, res) {

        // when submitting forms using HTTP POST method
        // the values in the input fields are stored in the req.body object
        // each <input> element is identified using its `name` attribute
        // Example: the value entered in <input type="text" name="fName">
        // can be retrieved using req.body.fName
        var fname = req.body.fname;
        var lname = req.body.lname;
        var email = req.body.email;
        var uname = req.body.uname;
        var pw = req.body.pw;

        // calls the function insertOne()
        // defined in the `database` object in `../models/db.js`
        // this function adds a document to collection `users`
        db.insertOne(User, {
            fname: fname,
            lname: lname,
            email: email,
            uname: uname,
            pw: pw
        });

        // upon adding a user to the database,
        // redirects the client to `/success` using HTTP GET,
        // defined in `../routes/routes.js`
        // passing values using URL
        // which calls getSuccess() method defined in `./successController.js`
        res.redirect('/success?uname=' + uname);
    },

    getCheckEmail: function (req, res) {

        // when passing values using HTTP GET method
        // the values are stored in the req.query object
        // Example url: `http://localhost/getCheckID?idNum=11312345`
        // To retrieve the value of parameter `idNum`: req.query.idNum
        var email = req.query.email;

        // calls the function findOne()
        // defined in the `database` object in `../models/db.js`
        // searches for a single document based on the model `User`
        // sends an empty string to the user if there are no match
        // otherwise, sends an object containing the idNum
        db.findOne(User, {email: email}, 'email', function (result) {
            res.send(result);
        });
    },

    getCheckUsername: function (req, res) {

        // when passing values using HTTP GET method
        // the values are stored in the req.query object
        // Example url: `http://localhost/getCheckID?idNum=11312345`
        // To retrieve the value of parameter `idNum`: req.query.idNum
        var uname = req.query.uname;

        // calls the function findOne()
        // defined in the `database` object in `../models/db.js`
        // searches for a single document based on the model `User`
        // sends an empty string to the user if there are no match
        // otherwise, sends an object containing the idNum
        db.findOne(User, {uname: uname}, 'uname', function (result) {
            res.send(result);
        });
    },

}


// exports the object `signupController` (defined above)
// when another script exports from this file
module.exports = signupController;