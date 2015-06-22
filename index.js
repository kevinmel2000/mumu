var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    mumu = new (require('./src/mumu'))();

server.listen(process.env.PORT || 5000);

app.get('/:command', function(req, res, next){
    res.json(mumu.execute(req.params.command, req.query.args));
});

io.on('connect', function(socket){
    socket.emit('chat', mumu.execute('greet'));
});

io.on('connection', function (socket) {
    socket.on('chat', function(data){
        // try to find mumu command
        var iscommand = false,
            message = '',
            tmp = [],
            command = '',
            args = '';

        for(var i=0; i<data.message.length; i++){
            message = data.message[i];
            if(message.indexOf('@' + mumu.tag) === 0){
                iscommand = true;
                tmp = message.split(' ');
                command = tmp[1];
                args = tmp.slice(2).join(' ') || '';
                socket.emit('chat', mumu.execute(command, args));
            }
        }

        if(!iscommand){
            socket.broadcast.emit('chat', data);
        }
    });
});