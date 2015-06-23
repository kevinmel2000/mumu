var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    mumu = new (require('./src/mumu'))(),
    locations = {};

server.listen(process.env.PORT || 5000);

app.get('/:command', function(req, res, next){
    res.json(mumu.execute(req.params.command, req.query.args));
});

io.on('connection', function (socket) {
    // greet connected user
    socket.emit('chat', mumu.execute('greet'));

    // listening chat
    socket.on('chat', function(data){
        console.log('chat data', data);
        // try to find mumu command
        var iscommand = false,
            message = '',
            tmp = [],
            command = '',
            args = '';

        for(var i=0; i<data.message.length; i++){
            message = data.message[i];
            if(message.indexOf(mumu.tag) === 0){
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

    // emit locations previously known
    for(var i in locations) if(locations.hasOwnProperty(i)) {
        socket.emit('map', locations[i]);
    }

    // listening location for map
    socket.on('map', function(data){
        socket.broadcast.emit('map', data);
        locations[data.name] = data;
    });
});