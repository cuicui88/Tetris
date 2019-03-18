var socket = io('ws://127.0.0.1:8000');

var local = new Local(socket);

var remote = new Remote(socket);

socket.on('waiting',function(str){
    document.getElementById('waiting').innerHTML = str;
})