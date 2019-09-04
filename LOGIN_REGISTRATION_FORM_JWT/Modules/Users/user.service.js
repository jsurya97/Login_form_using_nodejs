var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('D:/LOGIN_REGISTRATION_FORM_JWT/config');
var db = require('D:/LOGIN_REGISTRATION_FORM_JWT/db');
var User = db.User
var UserData = db.UserData
var multer = require('multer');
var path = require('path');

exports.createUser = async function(user) {
    console.log(user)
        // Creating a new Mongoose Object by using the new keyword
    var hashedPassword = bcrypt.hashSync(user.password, 8);
    var newUser = new User({
        username: user.username,
        password: hashedPassword,
    })
    var Userdatas = new UserData({
        email: user.email,
        date: new Date(),
        phone: user.phone,
        author: newUser._id,
        wallpaper: user.wallpaper
    })
    try {
        // Saving the User 
        var savedUser = await newUser.save();
        var savedUserData = await Userdatas.save();
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Creating User")
    }
}

exports.loginUser = async function(user) {
        // Creating a new Mongoose Object by using the new keyword
        try {
            // Find the User 
            var _details = await User.findOne({ username: user.username });
            var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
            var token = jwt.sign({ id: _details._id }, config.SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            return token;
        } catch (e) {
            // return a Error message describing the reason     
            throw Error("Error while Login User")
        }
    }
    // Async function to get the User List
exports.getUsers = async function(query, page, limit) {
    const myCustomLabels = {
        totalDocs: 'itemCount',
        //docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        pagingCounter: 'slNo',
        meta: 'paginator'
    };
    var options = {
            sort: { username: 1 },
            populate: 'author',
            page,
            limit,
            customLabels: myCustomLabels
        }
        // Try Catch the awaited promise to handle the error 
    try {
        // Return the Userd joined list that was retured by the mongoose promise
        var UserDatas = await UserData.paginate(query, options)
        return UserDatas

    } catch (e) {
        // return a Error message describing the reason  
        throw Error('Error while get User');
    }
}

exports.getUserBySearch = async function(search) {
    try {
        // Return the Userd joined list that was retured by the mongoose promise
        var UserDatas = await UserData.find().populate({ path: 'author', match: { 'username': new RegExp(search) } })
        console.log(UserDatas)
        return UserDatas

    } catch (e) {
        // return a Error message describing the reason  
        throw Error('Error while get User');
    }
}

exports.updateUser = async function(id) {
    try {
        //Find the old User Object by the Id
        var oldUser = await UserData.findById(id);
        return oldUser
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
}

exports.deleteUser = async function(id) {
    // Delete the User
    try {
        var deleted = await UserData.findByIdAndRemove(id)
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
}
var ext;
// diskStorage function used to determine within which folder the uploaded files should be stored
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        ext = path.extname(file.originalname)
        console.log(ext)
        if (ext == '.png' && ext == '.jpg' && ext == '.gif' && ext == '.jpeg') {
            cb(null, 'D://LOGIN_REGISTRATION_FORM_JWT/public/uploads/image')
        } else {
            switch (ext) {
                case ".exe":
                    cb(null, 'D://LOGIN_REGISTRATION_FORM_JWT/public/uploads/exe');
                    break;
                case ".json":
                    cb(null, 'D://LOGIN_REGISTRATION_FORM_JWT/public/uploads/json');
                    break;
                case ".txt":
                    cb(null, 'D://LOGIN_REGISTRATION_FORM_JWT/public/uploads/txt');
                    break;
                default:
                    cb(null, 'D://LOGIN_REGISTRATION_FORM_JWT/public/uploads/other');
            }
        }
    },
    //A function used to determine what the file should be named inside the folder.
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + "" + ext);
    }
});

// The storage engine to use for uploaded files.
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB upload limit
        files: 1 // 1 file
    },
});