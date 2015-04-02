var express = require('express');

var authRouter = require('./auth/auth-router');
var imageRouter = require('./image/image-router');

var apiRouter = express.Router();

apiRouter.use('/image', imageRouter);
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;
