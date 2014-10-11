bower      = require 'bower'
gulp       = require 'gulp'
prefixer   = require 'gulp-autoprefixer'
clean      = require 'gulp-clean'
coffee     = require 'gulp-coffee'
coffeelint = require 'gulp-coffeelint'
concat     = require 'gulp-concat'
connect    = require 'gulp-connect-multi'
jade       = require 'gulp-jade'
mincss     = require 'gulp-minify-css'
plumber    = require 'gulp-plumber'
sass       = require 'gulp-ruby-sass'
sequence   = require 'run-sequence'
connect    = connect()

gulp.task 'jade', ->
  gulp.src 'src/jade/*.jade'
    .pipe plumber()
    .pipe jade()
    .pipe plumber.stop()
    .pipe gulp.dest 'dst/'

gulp.task 'coffee', ->
  gulp.src 'src/coffee/**/*.coffee'
    .pipe coffeelint()
    .pipe coffeelint.reporter()
    # .pipe plumber()
    .pipe concat 'app.coffee'
    .pipe coffee()
    # .pipe plumber.stop()
    .pipe gulp.dest 'dst/js/'

gulp.task 'sass', ->
  gulp.src 'src/sass/*.sass'
    .pipe plumber()
    .pipe concat 'style.sass'
    .pipe sass()
    .pipe prefixer 'last 3 version'
    .pipe mincss()
    .pipe plumber.stop()
    .pipe gulp.dest 'dst/css/'

gulp.task 'copy', ->
  gulp.src 'src/image/**', {base: 'src/image'}
    .pipe gulp.dest 'dst/image/'

gulp.task 'bower', ->
  bower.commands.install().on 'end', (installed) ->
    gulp.src([
      'bower_components/bootstrap/dist/css/bootstrap.min.css'
      'bower_components/bootstrap/dist/css/bootstrap.css.map'
      'bower_components/bootstrap/dist/js/bootstrap.min.js'
    ]).pipe gulp.dest('./dst/lib/bootstrap/')

    gulp.src([
      'bower_components/bootstrap/dist/fonts/*'
      'bower_components/components-font-awesome/fonts/*'
    ]).pipe gulp.dest('./dst/lib/fonts/')

    gulp.src([
      'bower_components/components-font-awesome/css/font-awesome.min.css'
    ]).pipe gulp.dest('./dst/lib/components-font-awesome')

    gulp.src([
      'bower_components/jquery/dist/jquery.min.js'
      'bower_components/jquery/dist/jquery.min.map'
    ]).pipe gulp.dest('./dst/lib/jquery/')

gulp.task 'clean', ->
  gulp.src 'dst'
    .pipe clean()

gulp.task 'connect', connect.server({
    root: ['dst']
    port: 3939
    livereload: true
    open:
      browser: 'Google Chrome Canary'
  })

gulp.task 'watch', ->
  gulp.watch 'src/jade/**', ['jade']
  gulp.watch 'src/coffee/**', ['coffee']
  gulp.watch 'src/sass/**', ['sass']
  gulp.watch 'src/image/**', ['copy']
  gulp.watch 'dst/**', ['livereload']

gulp.task 'livereload', ->
  gulp.src ''
    .pipe connect.reload()

## Tasks
# Build Task
gulp.task 'build', ['clean'], -> 
  sequence ['bower', 'copy', 'sass', 'coffee', 'jade']

# Develop Task
gulp.task 'server', ->
  sequence ['build'], 'watch', 'connect'