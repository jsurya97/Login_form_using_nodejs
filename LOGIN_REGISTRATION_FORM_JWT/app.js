const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const mongo = require('mongodb');
var logger = require('morgan');
var multer = require('multer');
var config = require('./config');

//The express() function is a top-level function exported by the express module.
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layout/' }));
app.set('view engine', 'hbs');


//This tells express to log via morgan
//and morgan to log in the "dev" pre-defined format
app.use(logger('dev'));

//It parses incoming requests with JSON payloads and is based on body-parser.
app.use(bodyParser.json());
//It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: config.SECRET,
    saveUninitialized: false,
    resave: false
}))

app.use(expressValidator())

//connect flash
app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// api routes
app.use('/users', require('./Modules/Users/api/users.route'));


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({
//         error: {
//             message: error.message
//         }
//     });
// });

app.listen(8080, () => {
    console.log('Express server started at port : 2000');
});