/**
 * Created by Jose Herrera on 20/05/2017.
 */

$(function() {
    var boardSize = $('#boardSizeInput').val();

    function createTable() {
        var table = document.getElementById("boardTable");
        for(var i = 0; i < boardSize; i++){
            var row =  table.insertRow(i);
            for(var j = 0; j < boardSize; j++){
                row.insertCell(j);
            }
        }
    }
    createTable();

    function getPossibleMoves(){
        $.ajax('/possibleMoves',{
           async: false
        });
    }

    $('td').on('click',function (e) {
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent());
        alert('Row: ' + row + ', Column: ' + col);
    });
});