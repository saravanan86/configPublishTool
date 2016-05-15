var gulp = require('gulp'),
    gulpFilter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    path = require('path'),
    del = require('del'),
    fs = require('fs'),
    less = require('gulp-less'),
    watch = require('gulp-watch');

// Define paths variables
var temp_path = 'tmp',
    dest_path =  'www',
    js_dest_path = dest_path + '/js',
    font_dest_path = dest_path + '/fonts',
    css_dest_path = dest_path + '/css',
    jsFilter = gulpFilter( '**/*.js', { restore: true } );

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

var getBowerMainFiles = function( dir ){

    var dir = dir || 'bower_components',
        files = fileList( dir ),
        bowerMainFiles = [];

    for( var i = 0, len = files.length; i < len; i++ ) {

        if( files[i].match( /\/bower\.json$/ ) ){

            var json = JSON.parse(fs.readFileSync(files[i]));

            if( typeof json.main === 'string' ){

                //console.log('====Files===', json.main, files[i].replace(/bower\.json/,json.main), fs.readFileSync( files[i].replace(/bower\.json/,json.main) ));
                bowerMainFiles[ bowerMainFiles.length ] = files[i].replace(/bower\.json/,json.main);

            } else if( typeof json.main.length != 'undefined'){

                for( var item in json.main ){

                    bowerMainFiles[ bowerMainFiles.length ] = files[i].replace(/bower\.json/,json.main[ item ]);

                }

            }

        }

    }

    return bowerMainFiles;

}

gulp.task( 'default', [ 'clean' ]);

gulp.task( 'clean', [ 'publish' ], function(){

    del( [ temp_path + '/**' ] );

});

gulp.task( 'publish', [ 'extract-js', 'extract-fonts', 'extract-css', 'buildFromSrc' ], function() {


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

    return gulp.src( getBowerMainFiles() ) //mainBowerFiles(),{ base: 'bower_components' })
        .pipe( cssFilter )
        .pipe( less( { paths:  [path.join( 'bower_components', 'bootstrap', 'less')] } ) )
        .pipe( cleanCSS() )
        .pipe( rename( {
            suffix: ".min"
        } ))
        .pipe(gulp.dest(temp_path + '/css' ))
        .pipe( cssFilter.restore );

});

gulp.task( 'extract-fonts', function() {

    var fontFilter = gulpFilter(['*.eot', '*.woff*', '*.svg', '*.ttf'], {restore: true});

    return gulp.src('bower_components/bootstrap/fonts/*')
        .pipe( gulp.dest( temp_path+'/fonts' ) );

});


gulp.task( 'extract-js', function() {

    //var jsFilter = gulpFilter( '**/*.js', { restore: true } );

    return gulp.src( getBowerMainFiles() )
        .pipe( jsFilter )
        .pipe( uglify() )
        .pipe( rename( {
            suffix: ".min"
        } ))
        .pipe( gulp.dest( temp_path + '/js' ) )
        .pipe( jsFilter.restore );
});

gulp.task( 'buildFromSrc', function(){

        gulp.src( 'src/**' )
        .pipe( gulpFilter( 'src/css/**' ) )
        .pipe( gulp.dest( 'www' ) );

        gulp.src( 'src/**' )
        .pipe( gulpFilter( 'src/html/**' ) )
        .pipe( gulp.dest( 'www' ) );

        return gulp.src( 'src/**' )
        .pipe( gulpFilter( 'src/js/*.js', { restore: true } ) )
        .pipe( uglify() )
        .pipe( rename( {
            suffix: ".min"
        } ))
        .pipe( gulp.dest( 'www' ) )
        //.pipe( jsFilter.restore );

});

gulp.task( 'watch', function(){

    return gulp.src( 'src/**' )
        .pipe( watch( 'src/**', function(){

            gulp.start( 'buildFromSrc' );

        } ) );

});