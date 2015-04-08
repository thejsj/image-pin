/*jshint node:true */
'use strict';

var gulp = require('gulp');

var sass = require('node-sass');
var concat = require('gulp-concat');
var fs = require('fs');
var path = require('path');

gulp.task('js', function () {
  gulp.src([
      // Lodash
      './client/lib/lodash/lodash.js',
      // Angular
      './client/lib/angular/angular.js',
      // UI Bootrap and UI Router
      './client/lib/angular-bootstrap/ui-bootstrap.js',
      './client/lib/angular-bootstrap/ui-bootstrap-tpls.js',
      './client/lib/ui-router/release/angular-ui-router.js',
      // Masonry
      './client/lib/jquery/dist/jquery.min.js',
      './client/lib/jquery-bridget/jquery.bridget.js',
      './client/lib/imagesloaded/imagesloaded.pkgd.min.js',
      './client/lib/masonry/dist/masonry.pkgd.min.js',
      './client/lib/angular-masonry/angular-masonry.js',
      // Bind Table
      './client/lib/angular-socket-io/socket.js',
      './client/lib/BindTable/bindtable.js',
      // Angular Moment
      './client/lib/moment/moment.js',
      './client/lib/angular-moment/angular-moment.js',
      // Services
      './client/app/services/auth-factory.js',
      './client/app/services/image-factory.js',
      './client/app/services/comment-factory.js',
      // Controllers
      './client/app/home/home.js',
      './client/app/user/user.js',
      './client/app/single/single.js',
      './client/app/templates/header.js',
      './client/app/templates/add-image.js',
      './client/app/app.js',
      // File Upload
      './client/lib/ng-file-upload/angular-file-upload.js',
    ])
    .pipe(concat('main.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./client/dist/'));
});


gulp.task('sass', function () {
  sass.render({
    file: './client/assets/scss/main.scss',
  }, function (err, result) {
    if (err) {
      console.log(err);
    }
    fs.writeFileSync(
      path.join(__dirname, '/client/dist/main.css'),
      result.css.toString()
    );
  });
});

gulp.task('watch', ['js', 'sass'], function () {
  gulp.watch('./client/assets/scss/**/*.scss', ['sass']);
  gulp.watch('./client/app/**/*.js', ['js']);
});

gulp.task('default', ['js', 'sass']);
gulp.task('build', ['js', 'sass']);
