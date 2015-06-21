var math = require('mathjs');

module.exports = {
    name: 'Dove',
    tag: 'dove',
    greet: function(args){
        return [
            'Hello there, welcome to ' + this.name + '\'s Post Office, what can I do for you?',
            'Hints: \'@' + this.tag + ' help\' to know what I can do...'
        ];
    },
    help: function(args){
        return [
            'Here are command I learn:',
            '\'ping\' Return pong if connected',
            '\'echo <text>\' Rewrite what you write',
            '\'translate <from> <to> <text to translate>\' Translate from and to any language you prefer',
            '\'calculate <calculation>\' Do math calculation, also unit convertion '
        ];
    },
    ping: function(args){
        return 'pong';
    },
    echo: function(args){
        return args;
    },
    calculate: function(args){
        try{
            return args + ' => ' + math.eval(args).toString();
        }catch(e){
            return 'Sorry, can not calculate \'' + args + '\'';
        }
    },
    translate: function(args){
        var tmp = args.split(" "),
            from = tmp[0],
            to = tmp[1],
            search = tmp.slice(2);

        return 'from: ' + from + ', to: ' + to + ', search: ' + search;
    },
    search: function(args){
        return 'Search result: ' + args;
    },
    other: function(command, args){
        return 'Sorry, I don\'t learn \'' + command + '\' yet.'
    }
};