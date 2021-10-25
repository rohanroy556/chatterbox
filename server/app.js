/**
 * Module dependencies are added.
 */
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const config = require('./config');

/**
 * Initiate an express application.
 */
const app = express();

/**
 * Configure mongoose's promise to global promise.
 */
mongoose.Promise = global.Promise;

/**
 * Configure the application.
 */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: config.SESSION_SECRET,
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(express.static(config.OUTPUT_PATH))

/**
 * Configure to MongoDB database using mongoose.
 */
mongoose.connect(config.MONGODB.URL, {
    user: config.MONGODB.USER,
    pass: config.MONGODB.PASS,
    retryWrites: true,
    w: 'majority'
});

/**
 * Configure Models and Routes.
 */
require('./model');
require('./config/passport');
const controller = require('./controller');
app.use('/', controller);

/**
 * Handle errors by adding it as a middleware.
 */
app.use((err, req, res, next) => {
    res.status(err.status || 500).send('Some Error has occured');
});

// console.log(config);

/**
 * Start the application by listening to specified port.
 */
app.listen(config.PORT, () => console.log('Server running at port: ' + config.PORT));