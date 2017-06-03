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
        $scope.blackHasMoves = true;
        $scope.routeParams = $routeParams;
        $scope.boardSize = $routeParams.boardSize;
        $scope.possibleMoves = [];
        $scope.whiteMoves = [];
        $scope.turnMsg = "";
        $scope.firstTimeFlag = true;
        $scope.blackAmount = 0;
        $scope.whiteAmount = 0;

        $scope.range = function(min, max) {
            let array = [];
            for (let i = min; i < max; i++) {
                array.push(i);
            }
            return array;
        };
        $scope.getDisksAmount = function(color){
            $http({
                method: 'GET',
                url: '/disks/'+color,
            }).then(function successCallback(response) {
                if(color == "black"){
                    $scope.blackAmount = response.data.amount;
                }else if(color == "white"){
                    $scope.whiteAmount = response.data.amount;
                }
            });
        };
        $scope.whiteMakeMove = function (move) {
            $http({
                method: 'POST',
                url: '/placeDisk',
                data: {from: move.from,
                    to: move.to,
                    color: move.color,
                    direction: move.direction}
            }).then(function successCallback(response) {
                $scope.refreshDisks();
                $scope.turnMsg = "Tu turno";
            });
        };
        $scope.whitePlay = function () {
            setTimeout(function() {
                $http({
                    method: 'GET',
                    url: '/possibleMoves/white'
                }).then(function successCallback(response) {
                    $scope.whiteMoves = response.data;
                    if($scope.whiteMoves.length == 0){
                        if($scope.possibleMoves.length == 0){
                            alert("Ambos jugadores se quedaron sin jugadas, final de la partida.");
                            let winner = ($scope.blackAmount > $scope.whiteAmount) ? "Jugador" : "Maquina";
                            alert(winner+" gana.");
                            return;
                        }
                        alert("La maquina no tiene jugadas");
                        $scope.turnMsg = "Tu turno";
                        $scope.refreshDisks();
                    }
                    else{
                        let bestMove = $scope.getWhiteBestMove($scope.whiteMoves);
                        console.log("Jugada blanco:");
                        console.log(bestMove);
                        $scope.whiteMakeMove(bestMove);
                    }
                });
            }, 1000);
        };
        $scope.getWhiteBestMove = function (arrayMoves) {
            let bestAmountEatenDisk = 0;
            let bestMoveObj = arrayMoves[0];
            for(let i = 0; i < arrayMoves.length; i++){
                let currentMove = arrayMoves[i];
                let currentAmountEatenDisk = $scope.getAmountEatenDisk(currentMove);
                if(currentAmountEatenDisk > bestAmountEatenDisk){
                    bestAmountEatenDisk = currentAmountEatenDisk;
                    bestMoveObj = currentMove;
                }
            }
            return bestMoveObj;
        };
        $scope.getAmountEatenDisk = function (move) {
            let counter = 0;
            let direction = move.direction;
            let from = move.from;
            let to = move.to;

            if(direction == "top"){
                for(let x = from.xPos-1; x > to.xPos; x--){
                    counter++;
                }
                return counter;
            }else if(direction == "left"){
                for(let y = from.yPos-1; y > to.yPos; y--){
                    counter++;
                }
                return counter;
            }else if(direction == "bottom"){
                for(let x = from.xPos+1; x < to.xPos; x++){
                    counter++;
                }
                return counter;
            } else if(direction == "right"){
                for(let y = from.yPos+1; y < to.yPos; y++){
                    counter++;
                }
                return counter;
            }else if(direction == "leftTop"){
                let x = from.xPos;
                for(let y = from.yPos-1; y > to.yPos; y--){
                    x--;
                    counter++;
                }
                return counter;
            }else if(direction == "rightTop"){
                let x = from.xPos;
                for(let y = from.yPos+1; y < to.yPos; y++){
                    x--;
                    counter++;
                }
                return counter;
            }else if(direction == "leftBottom"){
                let x = from.xPos;
                for(let y = from.yPos-1; y > to.yPos; y--){
                    x++;
                    counter++;
                }
                return counter;
            }else if(direction == "rightBottom"){
                let x = from.xPos;
                for(let y = from.yPos+1; y < to.yPos; y++){
                    x++;
                    counter++;
                }
                return counter;
            }
        };
        $scope.getBlackPossibleMoves = function () {
            $http({
                method: 'GET',
                url: '/possibleMoves/black'
            }).then(function successCallback(response) {
                console.log("Posibles jugadas:");
                $scope.possibleMoves = response.data;
                console.log(response.data);
            });
        };
        $scope.placeDiskAt = function(x,y){
            let bestMove = {};
            let bestEatenCounter = 0;
            for(let i = 0; i < $scope.possibleMoves.length; i++){
                let obj = $scope.possibleMoves[i];
                let to = obj.to;
                if(x == to.xPos && y == to.yPos){
                    let amountOfEatenDisk = $scope.getAmountEatenDisk(obj);
                    if(amountOfEatenDisk > bestEatenCounter){
                        bestEatenCounter = amountOfEatenDisk;
                        bestMove = obj;
                    }
                }
            }
            if($scope.possibleMoves.length == 0){
                alert("No hay jugadas posibles");
                $scope.whitePlay();
            }
            else if(Object.keys(bestMove).length == 0){
                alert("Jugada invalida");
            }else{
                $http({
                    method: 'POST',
                    url: '/placeDisk',
                    data: {from: bestMove.from,
                        to: bestMove.to,
                        color: bestMove.color,
                        direction: bestMove.direction}
                }).then(function successCallback(response) {
                    $scope.refreshDisks();
                    $scope.turnMsg = "Turno de la maquina";
                    $scope.whitePlay();
                });
            }
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
                $scope.getBlackPossibleMoves();
                if($scope.possibleMoves.length == 0){
                    if($scope.firstTimeFlag){
                        $scope.firstTimeFlag = false;
                    }else{
                        alert("Quedaste sin jugadas, juega la maquina.");
                        $scope.whitePlay();
                    }
                }
                $scope.getDisksAmount("white");
                $scope.getDisksAmount("black");
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
                    $scope.blackAmount = 2;
                    $scope.whiteAmount = 2;
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