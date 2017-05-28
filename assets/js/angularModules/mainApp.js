/**
 * Created by Jose Herrera on 22/05/2017.
 */

angular.module('mainApp', ['ngRoute'])
    .controller('MainController', function($scope, $route, $routeParams, $location,$http) {
        $scope.playGame = function (boardSize) {
            $http({
                method: 'POST',
                url: '/playGame',
                data: {
                    boardSize: boardSize
                }
            }).then(function successCallback(response) {
                let url = "/play/"+boardSize;
                $location.path(url);
            });
        }
    })
    .controller('BoardController', function($scope, $route, $routeParams,$http) {
        $scope.routeParams = $routeParams;
        $scope.boardSize = $routeParams.boardSize;
        $scope.possibleMoves = [];
        $scope.turnMsg = "";
        $scope.range = function(min, max) {
            let array = [];
            for (let i = min; i < max; i++) {
                array.push(i);
            }
            return array;
        };
        $scope.getPossibleMoves = function () {
            $http({
                method: 'GET',
                url: '/possibleMoves'
            }).then(function successCallback(response) {
                console.log("Posibles jugadas:");
                $scope.possibleMoves = response.data;
                console.log(response.data);
            });
        };
        $scope.placeDiskAt = function(x,y){
            for(let i = 0; i < $scope.possibleMoves.length; i++){
                let obj = $scope.possibleMoves[i];
                let to = obj.to;
                if(x == to.xPos && y == to.yPos){
                    $http({
                        method: 'POST',
                        url: '/placeDisk',
                        data: {from: obj.from,
                               to: to,
                               color: obj.color,
                               direction: obj.direction}
                    }).then(function successCallback(response) {
                        $scope.refreshDisks();
                        $scope.turnMsg = "Turno de la maquina";
                    });
                    return;
                }
            }
            alert("Jugada invalida");
        };
        $scope.refreshDisks = function () {
            $http({
                method: 'GET',
                url: '/disks'
            }).then(function successCallback(response) {
                let disksArray = response.data;
                console.log("Lista de fichas:");
                console.log(disksArray);
                for(let i = 0; i < disksArray.length; i++){
                    let disk = disksArray[i];
                    console.log("lee ficha("+disk.xPos+","+disk.yPos+")");
                    let $row = $( "tr:eq("+disk.xPos+")");
                    let $column = $row.children().eq(disk.yPos);
                    let $disk = $column.find("div");
                    $disk.removeClass("diskDiv white black");
                    $disk.addClass("diskDiv " + disk.color);
                }
                $scope.getPossibleMoves();
            });
        };
        $scope.placeDisks = function () {
            $http({
                method: 'GET',
                url: '/placeDisks/'+$scope.boardSize
            }).then(function successCallback(response) {
                if(response){
                    console.log("Se añadieron las fichas.");
                    $scope.refreshDisks();
                    $scope.turnMsg = "Tu turno";
                    $('button').addClass("disabled").attr('disabled','');
                }
            });
        };
    })
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'MainController'
            })
            .when('/play/:boardSize', {
                templateUrl: 'board.html',
                controller: 'BoardController'
            });
    });