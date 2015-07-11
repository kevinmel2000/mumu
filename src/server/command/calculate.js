var math = require('mathjs');

module.exports = function(args){
    try{
        return args + ' => ' + math.eval(args).toString();
    }catch(e){
        return 'Sorry, can not calculate \'' + args + '\'';
    }
};