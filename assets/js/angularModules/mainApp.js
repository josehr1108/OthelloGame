/**
 * Created by Jose Herrera on 10/05/2017.
 */

// declare a module
var app = angular.module('myApp', []);

app.controller('AppCtrl', ['$scope','$http', function($scope,$http) {
    $scope.nSelected = "4";

    $scope.goHome = function () {
        $http.get('/home').then(function (response) {
            console.log("gg");
        })
    }
}]);