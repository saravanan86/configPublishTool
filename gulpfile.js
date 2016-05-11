var mainBowerFiles = require('main-bower-files'),
    gulp = require('gulp'),
    flatten = require('gulp-flatten'),
    gulpFilter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    path = require('path'),
    folders = require('gulp-folders'),
    dir = require('node-dir'),
    del = require('del');

// Define paths variables
var temp_path = 'tmp',
    dest_path =  'www',
    js_dest_path = dest_path + '/js';

gulp.task( 'default', [ 'clean' ]);

gulp.task( 'clean', [ 'publish' ], function() {

    return del( [ temp_path + '/**' ] );

});

gulp.task( 'publish', [ 'extract-from-components' ], function() {

    dir.subdirs( temp_path, function (err, subdirs) {

        if (err) throw err;
        for( var i = 0, len = subdirs.length; i < len; i++ ){

            gulp.src( subdirs[i] + "/*.js" )
                //.pipe( gulpFilter( '*.js' ) )
                .pipe( gulp.dest( js_dest_path ) );

        }

    });

});

// grab libraries files from bower_components, minify and push in /public
gulp.task( 'extract-from-components', function() {
    var jsFilter = gulpFilter( '**/*.js', { restore: true } ),
        cssFilter = gulpFilter( '**/*.css', { restore: true } ),
        fontFilter = gulpFilter( [ '**/*.eot', '**/*.woff*', '**/*.svg', '**/*.ttf' ], { restore: true } );

    return gulp.src(mainBowerFiles(),{ base: 'bower_components' })
        //.pipe( gulp.dest( dest_path + '/js/' ) )

        // grab vendor js files from bower_components, minify and push in /public
        .pipe( jsFilter )
        //.pipe(gulp.dest(dest_path + '/js/'))
        .pipe( uglify() )
        .pipe( rename( {
            suffix: ".min"
        } ))
        .pipe( gulp.dest( temp_path ) )
        .pipe( jsFilter.restore );
        /*.pipe( fontFilter )
        .pipe( flatten() )
        .pipe( gulp.dest( temp_path ) );*/

    /*
     folders(pathToFolder, function(folder){
     //This will loop over all folders inside pathToFolder main, secondary
     //Return stream so gulp-folders can concatenate all of them
     //so you still can use safely use gulp multitasking

     return gulp.src(path.join(pathToFolder, folder, '*.js'))
     .pipe(concat(folder + '.js'))
     .pipe(gulp.dest('dist'));
     })
     */

        // grab vendor css files from bower_components, minify and push in /public
        //.pipe(cssFilter)
        //.pipe(gulp.dest(dest_path + '/css'))
       // .pipe(minifycss())
      //  .pipe(rename({
       //     suffix: ".min"
        //}))
       // .pipe(gulp.dest(dest_path + '/css'))
        //.pipe(cssFilter.restore)

        // grab vendor font files from bower_components and push in /public
        /*.pipe(fontFilter)
        .pipe(flatten())
        .pipe(gulp.dest(dest_path + '/fonts'));*/
});