/*jshint node:true */
'use strict';

var config = require('config');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
require('protolog')();

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.set('transports', ['websocket', 'polling']);

var bodyParser = require('body-parser');

var auth = require('./api/auth');
var apiRouter = require('./api/api-router');
var socketHandler = require('./socket-handler');
var clientConfigParser = require('./client-config-parser');

server.listen(config.get('ports').http);

// Middlewares
app
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(session({
    secret: 'zfnzkwjehgweghw',
    resave: false,
    saveUninitialized: true
  }))
  .use(auth.initialize())
  .use(auth.session());

// Routes
app
  .use('/config.js', clientConfigParser)
  .use('/api/', apiRouter)
  .use('/uploads/', express.static(__dirname + '/../uploads'))
  .use(express.static(__dirname + '/../client'))
  .use('*', function (req, res) {
    res.status(404).send('404 Not Found').end();
  });

io.on('connection', socketHandler.bind(null, io));
