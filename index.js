var express = require('express');
var expressHandlebars = require('express-handlebars');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var five = require("johnny-five");

var board = new five.Board();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));

//setup handlebars
app.engine('hbs', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'hbs');

board.on("ready",function(){
  var led = new five.Led(13);

io.on('connection', function(socket){
  socket.on('led:on', function(msg){
    console.log('message: ' + msg);
    led.on();
  });
});

app.get('/', function(req, res){
    res.render('light');
});


app.post('/light', function(req, res){
    console.log(req.body)
    res.redirect('/');
    var lightStatus = req.body.status;

    if(lightStatus ==="on"){
      led.on();
    }
    else if(lightStatus ==="off"){
      led.stop().off();
    }
});

var port = process.env.port || 3007;
http.listen(port, function(){
    console.log('running at port :' , port)
});
});
