/*jshint node:true */
'use strict';

var _ = require('lodash');
var multiparty = require('multiparty');
var fs = require('fs');
var imageToAscii = require('image-to-ascii');

var checkType = require('../../check-type');
var r = require('../../db');

var imageDownload = function (req, res) {
  var id = req.params.id;
  r
    .table('photos')
    .get(id)
    .run(r.conn)
    .then(function (result) {
      res.setHeader('Content-disposition', 'attachment; filename=' + result.fileName);
      res.send(result.file);
    }.bind(this));
};

var imageCreate = function (req, res) {
  if (req.body.image) {
    if (!checkType(req.body.image.type)) {
      res.status(400).json({
        'error': 'imageError',
        'message': 'Only JPEG/PNG/GIF allowed'
      });
      return;
    }
    if (req.body.image.size > 800000) {
      res.status(400).json({
        'error': 'sizeError',
        'message': 'Image must be uner 800kb'
      });
      return;
    }
    r
      .table('photos')
      .insert(req.body.image)
      .run(r.conn)
      .then(function (query_result) {
        res.json( {
          id: query_result.generated_keys[0]
        });
      });
  }
};

var deleteImage = function (id) {
  return r.table('photos')
    .get(id)
    .delete()
    .run(r.conn);
};

var imageUpdate = function (req, res) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    var imagePath = files.file[0].path;
    var imageId = fields.id[0];

    if (imagePath) {
      imageToAscii({
        path: imagePath,
        size: {
          width: 200,
          height: '100%'
        }
      }, function(err, converted) {
        console.log('Inserting Image:', new Date().toString());
        console.log(err || converted);
      });
    }

    fs.readFile(imagePath, function (err, buffer) {
      var image = r.binary(buffer);
      r.table('photos')
       .get(imageId)
       .update({
         file: image,
         path: imagePath
       })
       .run(r.conn)
       .then(function (query_result) {
         res.json({
           id: req.params.id
         });
       });
    });
  });
};

exports.download = imageDownload;
exports.create = imageCreate;
exports.update = imageUpdate;
