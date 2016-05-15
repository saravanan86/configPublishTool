var configToolApp = angular.module( 'configToolApp', [ 'ui.bootstrap' ] );

configToolApp.factory( 'Sites', function(){

    var sites=[ 'www.mtv.com', 'www.vh1.com', 'www.cmt.com', 'www.nick.com', 'www.nickjr.com', 'www.cc.com', 'www.jokes.com', 'www.logo.com' ];

    return sites;
});

configToolApp.controller( 'searchController',  [ "$scope", "Sites", function( $scope, Sites ){

    //console.log('=======',Sites);
    $scope.siteSearch = undefined;
    $scope.sites = Sites;

}]);