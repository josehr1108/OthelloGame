/**
 * Created by Jose Herrera on 02/05/2017.
 */
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

// set up handlebars view engine
var handlebars = require('express3-handlebars')
    .create({ defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + "/assets"));
app.use(require('body-parser')());

var swipl = require('swipl');
swipl.call('consult(fichas)');

app.get('/', function(req, res) {
    res.render('home');
});

app.post('/playGame', function(req, res) {
    var selectedOpt = req.body.boardSize;
    swipl.call('retractall(boardSize(X))');
    swipl.call('assert(boardSize('+selectedOpt+'))');
    res.render('board',{boardSize: selectedOpt,layout: 'boardLayout'});
});

app.get('/possibleMoves',function (req, res) {
    var query1 = new swipl.Query('getPossibleMovements("black")');
    var ret1 = null;
    while (ret1 = query1.next()) {
        console.log("iteracion");
    }
    query1.close();

    var query = new swipl.Query('possibleMovement(X)');
    var ret = null;
    var array = [];
    while (ret = query.next()) {
        var coordinate = [];
        console.log('Variable X value is:'+ret.X.head);
        coordinate.push(ret.X.head);
        coordinate.push(ret.X.tail.head);
        array.push(coordinate);
    }
    query.close();
    res.send(200,array);
});

app.get('/de')

app.get('/prueba',function (req, res) {
    var query = swipl.call('boardSize(X)');
    var size;
    if(query){
        console.log("Tamaño del tablero:" + query.X);
        size = query.X;
    }else{
        console.log("Fallo");
    }
    return res.send(200,size);
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' );
});
