var mainBowerFiles = require('main-bower-files'),
    gulp = require('gulp'),
    flatten = require('gulp-flatten'),
    gulpFilter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    path = require('path'),
    del = require('del'),
    fs = require('fs'),
    less = require('gulp-less');

// Define paths variables
var temp_path = 'tmp',
    dest_path =  'www',
    js_dest_path = dest_path + '/js',
    font_dest_path = dest_path + '/fonts',
    css_dest_path = dest_path + '/css';

var fileList = function( dir, filelist ) {

    var files = fs.readdirSync( dir) ;

    filelist = filelist || [];

    files.forEach( function( file ) {

        if ( fs.statSync( dir + '/' + file ).isDirectory() ) {

            filelist = fileList( dir + '/' + file + '/', filelist);

        } else {

            filelist.push( ( dir + file ).replace( /\/\//g,'/') );

        }

    });

    return filelist;
};

gulp.task( 'default', [ 'clean' ]);

gulp.task( 'clean', [ 'publish' ], function(){

    del( [ temp_path + '/**' ] );

});

gulp.task( 'publish', [ 'extract-js', 'extract-fonts', 'extract-css' ], function() {


    var files = fileList( temp_path );


    for( var i = 0, len = files.length; i < len; i++ ) {

        if( files[i].match( /\.min\.js$/ ) ){

            gulp.src( files[i] )
                .pipe( gulp.dest( js_dest_path ) );

        } else if( files[i].match( /\/fonts\// ) ){

            gulp.src( files[i] )
                .pipe( gulp.dest( font_dest_path ) );

        } else if( files[i].match( /\.css$/ ) ){

            gulp.src( files[i] )
                .pipe( gulp.dest( css_dest_path ) );

        }


    }

});

gulp.task( 'extract-css', function(){

    var cssFilter = gulpFilter( '**/*.less', { restore: true } );

    return gulp.src(mainBowerFiles(),{ base: 'bower_components' })
        .pipe( cssFilter )
        .pipe( less( { paths:  [path.join( 'bower_components', 'bootstrap', 'less')] } ) )
        .pipe(gulp.dest(temp_path ))
        .pipe( cssFilter.restore );

});

gulp.task( 'extract-fonts', function() {

    var fontFilter = gulpFilter(['*.eot', '*.woff*', '*.svg', '*.ttf'], {restore: true});

    return gulp.src('bower_components/bootstrap/fonts/*')
        .pipe( gulp.dest( temp_path+'/fonts' ) );

});


gulp.task( 'extract-js', function() {

    var jsFilter = gulpFilter( '**/*.js', { restore: true } );

    return gulp.src(mainBowerFiles(),{ base: 'bower_components' })
        .pipe( jsFilter )
        .pipe( uglify() )
        .pipe( rename( {
            suffix: ".min"
        } ))
        .pipe( gulp.dest( temp_path ) )
        .pipe( jsFilter.restore );
});