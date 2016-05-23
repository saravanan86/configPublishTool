var configToolApp = angular.module( 'configToolApp', [ 'ui.bootstrap', 'ngRoute', 'xeditable' ] );


configToolApp.run([ 'editableOptions', function( editableOptions ) {

    editableOptions.theme = 'default'; // bootstrap3 theme. Can be also 'bs2', 'default'

}]);

configToolApp.factory( 'Sites', function(){

    var sites=[ 'www.mtv.com', 'www.vh1.com', 'www.cmt.com', 'www.nick.com', 'www.nickjr.com', 'www.cc.com', 'www.jokes.com', 'www.logo.com' ];

    return sites;
});

configToolApp.controller( 'searchController',  [ '$scope', 'Sites', function( $scope, Sites ){

    //console.log('=======',Sites);
    $scope.siteSearch = undefined;
    $scope.sites = Sites;

    $scope.selectAppId = function( $item, $model, $label, $event ){

        //console.log('=======$item, $model, $label=====', $item, $model, $label);
        location.href = '#view/'+$item;

    };

}]);

configToolApp.controller( 'viewController', [ '$scope', '$routeParams', '$http', function ( $scope, $routeParams, $http ) {
    //console.log('=========AppId===', $routeParams.appId);
    $scope.appId = $routeParams.appId;
    var dataTypes = [];

    $http.get( "http://localhost:8880/getMetadataTypes" ).then( function( response ){
        console.log('===================', response.data);
        //$scope.responseData = response.data;
        var dbData = response.data;
        for( var i = 0, len = dbData.length; i < len; i++ ){

            dataTypes[ dataTypes.length ] = {

                dataType: dbData[ i ].dataType,
                valueType: dbData[ i ].dataDefaultValue+"",
                defaultValue: dbData[ i ].valueType

            };

        }

    });

    $scope.metadataTypes = dataTypes;

}]);

configToolApp.config( [ '$routeProvider', function( $routeProvider ){

    $routeProvider.
        when( '/view/:appId',{ templateUrl: 'view.html', controller: 'viewController' } )
        .otherwise( { template: '<h1>App configuration tool.</h1><p class="lead">Use this tool to create or update App configs.</p>' } );

}]);
