/**
 * Created by Jose Herrera on 02/05/2017.
 */
let express = require('express');
let app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + "/assets"));
app.use(express.static(__dirname + "/public"));
app.use(require('body-parser')());

let swipl = require('swipl');
swipl.call('consult(fichas)');


app.post('/playGame', function(req, res) {
    let selectedOpt = req.body.boardSize;
    swipl.call('assert(boardSize('+selectedOpt+'))');
    res.send(200,{});
});

app.post('/placeDisk',function (req,res) {
    let from = req.body.from;
    let to = req.body.to;
    let color = req.body.color;
    let direction = req.body.direction;
    swipl.call('assert(disk('+to.xPos+','+to.yPos+',"'+color+'"))');
    replaceDisks(from,to,color,direction);
    res.send(200,{success:true});
});

app.get('/possibleMoves/:colorParam',function (req, res) {
    swipl.call('retractall(possibleMovement(Q,W,E,R))');
    let colorP = req.params.colorParam;

    let query1 = new swipl.Query('getPossibleMovements("'+colorP+'")');
    let ret1 = null;
    let counter = 0;
    while (ret1 = query1.next()) {
        counter++;
        console.log("entra al ciclo de movimientos");
    }
    query1.close();

    let array = [];
    let query = new swipl.Query('possibleMovement(From,To,Color,Direction)');
    let ret = null;
    while (ret = query.next()) {
        let possibleMove = {};

        let fromObj = {};
        fromObj.xPos = ret.From.head;
        fromObj.yPos = ret.From.tail.head;
        possibleMove.from = fromObj;

        let toObj = {};
        toObj.xPos = ret.To.head;
        toObj.yPos = ret.To.tail.head;
        possibleMove.to = toObj;

        let definitiveColor = "";
        if(ret.Color == "white")
            definitiveColor = "black";
        else if(ret.Color == "black")
            definitiveColor = "white";

        possibleMove.color = definitiveColor;
        possibleMove.direction = ret.Direction;

        array.push(possibleMove);
    }
    query.close();
    res.send(200,array);
});

app.get('/disks',function (req, res) {
    let query = new swipl.Query('disk(X,Y,C)');
    let ret = null;
    let array = [];
    while (ret = query.next()) {
        let disk = {};
        disk.xPos = ret.X;
        disk.yPos = ret.Y;
        disk.color = ret.C;
        array.push(disk);
    }
    query.close();
    res.json(array);
});

app.get('/disks/:color',function (req, res) {
    let colorP = req.params.color;

    let query = new swipl.Query('disk(X,Y,"'+colorP+'")');
    let ret = null;
    let counter = 0;
    while (ret = query.next()) {
        counter++;
    }
    query.close();
    res.send(200,{amount: counter});
});

app.get('/placeDisks/:boardSize',function (req, res) {
    swipl.call('retractall(disk(X,Y,C))');
    let size = req.params.boardSize;
    let query = swipl.call('placeDisks('+size+')');
    if(query){
        console.log("Agrego las fichas");
        res.send(200,{added: true});
    }else{
        console.log("Fallo agregando fichas");
        res.send(303,{added: false});
    }
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' );
});

function replaceDisks(from,to,color,direction){
    if(direction == "top"){
        for(let x = from.xPos-1; x > to.xPos; x--){
            swipl.call('retract(disk('+x+','+from.yPos+',_))');
            swipl.call('assert(disk('+x+','+from.yPos+',"'+color+'"))');
            console.log("Se cambio la ficha ("+x+","+from.yPos+")");
        }
    }else if(direction == "left"){
        for(let y = from.yPos-1; y > to.yPos; y--){
            swipl.call('retract(disk('+from.xPos+','+y+',_))');
            swipl.call('assert(disk('+from.xPos+','+y+',"'+color+'"))');
            console.log("Se cambio la ficha ("+from.xPos+","+y+")");
        }
    }else if(direction == "bottom"){
        for(let x = from.xPos+1; x < to.xPos; x++){
            swipl.call('retract(disk('+x+','+from.yPos+',_))');
            swipl.call('assert(disk('+x+','+from.yPos+',"'+color+'"))');
            console.log("Se cambio la ficha ("+x+","+from.yPos+")");
        }
    } else if(direction == "right"){
        for(let y = from.yPos+1; y < to.yPos; y++){
            swipl.call('retract(disk('+from.xPos+','+y+',_))');
            swipl.call('assert(disk('+from.xPos+','+y+',"'+color+'"))');
            console.log("Se cambio la ficha ("+from.xPos+","+y+")");
        }
    }else if(direction == "leftTop"){
        let x = from.xPos;
        for(let y = from.yPos-1; y > to.yPos; y--){
            x--;
            swipl.call('retract(disk('+x+','+y+',_))');
            swipl.call('assert(disk('+x+','+y+',"'+color+'"))');
            console.log("Se cambio la ficha ("+x+","+y+")");
        }
    }else if(direction == "rightTop"){
        let x = from.xPos;
        for(let y = from.yPos+1; y < to.yPos; y++){
            x--;
            swipl.call('retract(disk('+x+','+y+',_))');
            swipl.call('assert(disk('+x+','+y+',"'+color+'"))');
            console.log("Se cambio la ficha ("+x+","+y+")");
        }
    }else if(direction == "leftBottom"){
        let x = from.xPos;
        for(let y = from.yPos-1; y > to.yPos; y--){
            x++;
            swipl.call('retract(disk('+x+','+y+',_))');
            swipl.call('assert(disk('+x+','+y+',"'+color+'"))');
            console.log("Se cambio la ficha ("+x+","+y+")");
        }
    }else if(direction == "rightBottom"){
        let x = from.xPos;
        for(let y = from.yPos+1; y < to.yPos; y++){
            x++;
            swipl.call('retract(disk('+x+','+y+',_))');
            swipl.call('assert(disk('+x+','+y+',"'+color+'"))');
            console.log("Se cambio la ficha ("+x+","+y+")");
        }
    }
}