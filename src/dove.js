module.exports = function(config){
    var Bot = require('./bot');

    config   = config || {};
    Bot.name = config.name || Bot.name;
    Bot.tag  = config.tag || Bot.tag;

    this.execute = function(command, args){
        command = command || '';
        args = args || '';

        try{
            var res = {
                name: Bot.name,
                message: typeof Bot[command] === 'function' ? Bot[command](args) : Bot.other(command, args),
                timestamp: +new Date()
            };

            res.message = res.message || '';
            if(typeof res.message === 'string') res.message = [res.message];

            return res;
        }catch(e){
            return {error: e.message};
        }
    };
};