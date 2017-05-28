/**
 * Created by Jose Herrera on 20/05/2017.
 */

$(function() {
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