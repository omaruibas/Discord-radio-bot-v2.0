const { Events }=require('discord.js');

const debugger_requests=require('../utils/debugger');
const {types}=require('../json/types.json');


module.exports={
    event:Events.GuildCreate,
    once:false,
    async execute(commandsCollection,client,guild)
    {
        try{
            commandRegisteror.registerCommandsToGuild(guild.id);
        }catch(error)
        {
           debugger_requests.sendRequest({type:types.ERROR,stack:error.stack,content:[error]});
        }
    }
}