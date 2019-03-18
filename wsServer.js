var app = require("http").createServer();
var io = require("socket.io")(app);

//客户端计数
var clientCount = 0;
app.listen(8000,"127.0.0.1");
//用来存储客户端socket
var socketMap = {};

var bindListener = function(socket,event){
    socket.on(event,function(data){
        if(socket.clientNum % 2 == 0){
            if(socketMap[socket.clientNum-1]){
                socketMap[socket.clientNum-1].emit(event,data);
            }
        }else{
            if(socketMap[socket.clientNum+1]){
                socketMap[socket.clientNum+1].emit(event,data);
            }
        }
    });
};

io.on('connection',function(socket){
    clientCount = clientCount+1;
    socket.clientNum = clientCount;
    socketMap[clientCount] = socket;
    
    //如果是第奇数个进来的，那么就要等待与他配对的人
    if(clientCount % 2 == 1){
        socket.emit('waiting','waiting for another person~');
    }else{
        if(socketMap[socket.clientNum-1]){
            socket.emit('start');
            socketMap[(clientCount-1)].emit('start');
        }else{
            socket.emit('leave');
        }
    }
    bindListener(socket,'init');
    bindListener(socket,'next');
    bindListener(socket,'rotate');
    bindListener(socket,'right');
    bindListener(socket,'down');
    bindListener(socket,'left');
    bindListener(socket,'fall');
    bindListener(socket,'fixed');
    bindListener(socket,'line');
    bindListener(socket,'time');
    bindListener(socket,'lose');
    bindListener(socket,'bottomLines');
    bindListener(socket,'addTailLines');

    socket.on('disconnect',function(){
        if(socket.clientNum % 2 == 0){
            if(socketMap[socket.clientNum-1]){
                socketMap[socket.clientNum-1].emit('leave');
            }
        }else{
            if(socketMap[socket.clientNum+1]){
                socketMap[socket.clientNum+1].emit('leave');
            }
        }
        delete(socketMap[socket.clientNum]);
    });
})

console.log("websocket listening on port 8000");