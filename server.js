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

var swipl = require('swipl');
swipl.call('consult(fichas)');

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/prueba',function (req, res) {
    var query = new swipl.Query('ficha(X,Y,Z)'); //fila, columna y color
    var ret = null;
    var array = [];
    while (ret = query.next()) {
        var temp = {};
        temp.fila = ret.X;
        temp.columna = ret.Y;
        temp.color = ret.Z;
        array.push(temp);
    }
    query.close();
    return res.json(array);
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' );
});