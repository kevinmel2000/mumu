var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    dove = new (require('./src/dove'))();

server.listen(process.env.PORT || 5000);

app.get('/:command', function(req, res, next){
    res.json(dove.execute(req.params.command, req.query.args));
});

io.on('connection', function (socket) {
    socket.emit('postoffice', dove.execute('greet'));
});