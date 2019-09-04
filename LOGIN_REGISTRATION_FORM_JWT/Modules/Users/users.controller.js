const express = require('express');
const userService = require('./user.service');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var expressValidator = require('express-validator');
var multer = require('multer');
const path = require('path');

exports.getIndex = async function(req, res, next) {
    try {
        return res.render('index')
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getLogin = async function(req, res, next) {
    try {
        return res.render('login')
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getRegister = async function(req, res, next) {
    try {
        return res.render('register')
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.createUser = async function(req, res, next) {

    // Req.Body contains the form submit values.
    var User = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        wallpaper: req.file.path
    }

    // req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    // req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    // req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    // req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    // req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    // req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    // req.checkBody('confirm_password', 'Password must be between 8-100 characters long.').len(8, 100);
    // req.checkBody('confirm_password', 'Passwords do not match, please try again.').equals(req.body.password);
    // // Additional validation to ensure username is alphanumeric with underscores and dashes
    // req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
    // var errors = req.validationErrors();
    // if (errors) {
    //     return res.render('register', {
    //         viewTitle: 'Register Error',
    //         errors: errors
    //     });
    // }

    try {
        // Calling the Service function with the new object from the Request Body
        var createdUser1 = await userService.createUser(User)
        if (createdUser1 == "exists") {
            req.flash('error_msg', "username already exists")
            return res.redirect('/users/register')

        }
        req.flash('success_msg', "you are registered success, login now")
        return res.redirect('/users/login')
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        req.flash('error_msg', "Register Unsuccessfull!!!!!!!!!!")
        return res.redirect('/users/register')
    }
}

exports.loginUser = async function(req, res, next) {
    var User = {
        username: req.body.username,
        password: req.body.password
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var loginUser = await userService.loginUser(User);
        req.session.token = loginUser;
        return res.redirect('/users/list/1')
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        req.flash('error_msg', "Invalid username/password")
        return res.redirect('/users/login')
    }
}

// Async Controller function to get the To do List
exports.getUsers = async function(req, res, next) {
    var page = Number(req.params.page)
    try {
        var users = await userService.getUsers({}, page, 5)
            // Return the Users list with the appropriate HTTP password Code and Message.
        return res.render("list", {
            users: users.docs,
            total: users.total,
            limit: users.limit,
            page: users.page,
            pages: users.pages
        });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }
}

exports.getUserBySearch = async function(req, res, next) {
    var search = req.body.Search
    console.log(search)
    try {
        var users = await userService.getUserBySearch(search)
        console.log(users)
            // Return the Users list with the appropriate HTTP password Code and Message.
            //return res.status(200).json({ data: Users });
            //return res.send(Users)
        return res.render("list", {
            users: users,
        });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({ status: 400, message: e.message });
    }


}
exports.updateUser = async function(req, res, next) {

    // Id is necessary for the update
    if (!req.params._id) {
        return res.status(400).json({ status: 400., message: "Id must be present" })
    }

    var id = req.params._id;

    try {
        var updatedUser = await userService.updateUser(id)
        return res.render("register", {
            viewTitle: "Update Employee",
            list: updatedUser
        });
    } catch (e) {
        return res.status(400).json({ status: 400., message: e.message })
    }
}

exports.removeUser = async function(req, res, next) {
    var id = req.params.id;
    try {
        var deleted = await userService.deleteUser(id);

        return res.redirect('/users/list/1')
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message })
    }
};