var list        = require('./command'),
    helps       = {},
    commands    = {};

for(var i in list) if(list.hasOwnProperty(i)){
    helps[i] = list[i];
    commands[i] = require('./command/' + i + '.js');
}

module.exports = {
    name: 'Mumu',
    tag: '@mumu',
    '': function(){
        return 'Do you call me? What can I do to help you?';
    },
    greet: function(args){
        return [
            'Mumu here :3 ',
            'Mention \'' + this.tag + '\' if you need any help'
        ];
    },
    help: function(args){
        if(args === ''){
            return [
                'Here are things I learn:',
                Object.keys(commands).join(', '),
                'Type \'@mumu help <command>\' to display command help'
            ];
        }else if(typeof helps[args] !== 'undefined'){
            return helps[args];
        }else{
            return 'Sorry, I don\'t learn \'' + command + '\' yet.'
        }
    },
    other: function(command, args){
        try{
            return commands[command](args);
        }catch(e){
            return 'Sorry, I don\'t learn \'' + command + '\' yet.'
        }
    }
};