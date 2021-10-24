const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const config = require('./config');
const app = express();

mongoose.Promise = global.Promise;

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

mongoose.connect(config.MONGODB.URL, {
    user: config.MONGODB.USER,
    pass: config.MONGODB.PASS,
    retryWrites: true,
    w: 'majority'
});

require('./model');
require('./config/passport');
const controller = require('./controller');
app.use('/', controller);

app.use((err, req, res, next) => {
    res.status(err.status || 500).send('Some Error has occured');
});

console.log(config);
app.listen(config.PORT, () => console.log('Server running at port: ' + config.PORT));