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

app.get('/:sessionId', function(req,res){
    //console.log(url.parse(req.url,true));
    console.log("session: %s",req.params.sessionId);
    console.log(req.query);


    res.render('index',{title:"TITLE", sessionId: req.params.sessionId});
});

// init socket
var io=require('socket.io')(server);

// https://gist.github.com/arisetyo/5928974
var Sessions=new Array();

io.on('connection',function(socket){
    var mSessionID="";
    console.log('connected');
    // http://socket.io/docs/rooms-and-namespaces/
    //console.log(socket);
    //socket.emit('pushdata',messageArray);
    socket.on('join', function(sessionId){
        socket.join(sessionId);
        mSessionID= sessionId;
    });
    socket.on('input',function(data){
        console.log('input:%j' , data);
        if( !Sessions[mSessionID] ){
            Sessions[mSessionID]=new Array();
        }
        Sessions[mSessionID].push(data);
        io.to(mSessionID).emit('pushdata',Sessions[mSessionID]);
    });
    socket.on('disconnect',function(){
        io.sockets.emit("user disconnected");
    });
});


