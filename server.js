const api = require('./routes/api');
const auth = require('./config/passport')();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/database');

const app = express();

mongoose.connect(config.database);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(logger('dev'));
app.use(cookieParser());
app.use(auth.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', api);

app.listen(process.env.PORT || 3000);
