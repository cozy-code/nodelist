var express=require('express');
var morgan=require('morgan');   //for logging
var url = require('url');

var app=express();

// init socket
var server = require('http').Server(app);
var io=require('socket.io')(server);

// set template engine
app.set('views', __dirname + '/views');
app.set('view engine','ejs');

// middleware
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

var server = app.listen(3000);

app.get('/', function(req,res){
    //console.log(url.parse(req.url,true));
    console.log(req.query);


    res.render('index',{title:"TITLE", socketURL: req.protocol + "://" + req.hostname + ":" + "3000"});
});

// init socket
var io=require('socket.io')(server);

// https://gist.github.com/arisetyo/5928974
var messageArray=new Array();

io.on('connection',function(socket){
    console.log('connected');
    socket.emit('pushdata',messageArray);
    socket.on('input',function(data){
        console.log('input:%j' , data);
        messageArray.push(data);
        io.sockets.emit('pushdata',messageArray);
    });
    socket.on('disconnect',function(){
        io.sockets.emit("user disconnected");
    });
});


