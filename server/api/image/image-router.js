var express = require('express');

var imageController = require('./image-controller');

var imageRouter = express.Router();

imageRouter.get('/download/:id', imageController.download);
imageRouter.post('/:id', imageController.update);
imageRouter.put('/:id', imageController.update);
imageRouter.post('/', imageController.create);

module.exports = imageRouter;
