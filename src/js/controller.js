var configToolApp = angular.module( 'configToolApp', [ 'ui.bootstrap', 'ngRoute' ] );

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

configToolApp.controller( 'viewController', [ '$scope', '$routeParams', function ( $scope, $routeParams ) {
    //console.log('=========AppId===', $routeParams.appId);
    $scope.appId = $routeParams.appId;

}]);

configToolApp.config( [ '$routeProvider', function( $routeProvider ){

    $routeProvider.
        when( '/view/:appId',{ templateUrl: 'view.html', controller: 'viewController' } )
        .otherwise( { template: '<h1>App configuration tool.</h1><p class="lead">Use this tool to create or update App configs.</p>' } );

}]);