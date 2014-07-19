bower    = require 'bower'
gulp     = require 'gulp'
prefixer = require 'gulp-autoprefixer'
clean    = require 'gulp-clean'
coffee   = require 'gulp-coffee'
concat   = require 'gulp-concat'
connect  = require 'gulp-connect-multi'
jade     = require 'gulp-jade'
mincss   = require 'gulp-minify-css'
plumber  = require 'gulp-plumber'
sass     = require 'gulp-ruby-sass'
sequence = require 'run-sequence'
connect  = connect()

gulp.task "jade", ->
  gulp.src "src/jade/*.jade"
    .pipe plumber()
    .pipe jade()
    .pipe gulp.dest "dst/"
    .pipe connect.reload()

gulp.task "coffee", ->
  gulp.src "src/coffee/*.coffee"
    .pipe plumber()
    .pipe coffee()
    .pipe gulp.dest "dst/js/"
    .pipe connect.reload()

gulp.task "sass", ->
  gulp.src "src/sass/*.sass"
    .pipe plumber()
    .pipe concat "style.sass"
    .pipe sass()
    .pipe prefixer 'last 2 version'
    .pipe mincss()
    .pipe gulp.dest "dst/css/"
    .pipe connect.reload()

gulp.task "bower", ->
  bower.commands.install().on 'end', (installed) ->
    gulp.src([
      'bower_components/bootstrap/dist/css/bootstrap.min.css'
      'bower_components/bootstrap/dist/css/bootstrap.css.map'
      'bower_components/bootstrap/dist/js/bootstrap.min.js'
      'bower_components/bootstrap/dist/fonts/*'
    ]).pipe gulp.dest('./dst/lib/bootstrap/')

    gulp.src([
      'bower_components/jquery/dist/jquery.min.js'
      'bower_components/jquery/dist/jquery.min.map'
    ]).pipe gulp.dest('./dst/lib/jquery/')


gulp.task "clean", ->
  gulp.src "dst/"
    .pipe clean()

gulp.task "connect", connect.server({
    root: ["dst/"]
    port: 3939
    livereload: true
    open:
      browser: "Google Chrome Canary"
  })

gulp.task "watch", ->
  gulp.watch "src/jade/**", ["jade"]
  gulp.watch "src/coffee/**", ["coffee"]
  gulp.watch "src/sass/**", ["sass"]

## Tasks
# Build Task
gulp.task 'build', ['clean'], ->
  gulp.start 'bower', 'sass', 'coffee', 'jade'

# Server Task
gulp.task 'server', ->
  sequence 'build', 'connect', 'watch'