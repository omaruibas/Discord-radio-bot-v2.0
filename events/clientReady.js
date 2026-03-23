const { Events }=require('discord.js')

const { resolvingLoop }=require('../functions/voice/resolvingLoop');
const { types }=require('../json/types.json');
const debugger_requests=require('../utils/debugger');

const recievements={};

module.exports={
    event:Events.ClientReady,
    once:true,
    async execute(commandsCollection,client,readyClient)
    {
        debugger_requests.sendRequest({type:types.NORMAL,content:[`Logged in as ${readyClient.user.tag}`]});
        resolvingLoop(client);

        for (const [guildId] of readyClient.guilds.cache)
        {
            try{
                if(!recievements.commandRegisteror){return;}
                recievements.commandRegisteror.registerCommandsToGuild(readyClient.guilds.cache.get(guildId));
            }catch(error)
            {
                debugger_requests.sendRequest({type:types.ERROR,stack:error.stack,content:[error]});
                continue;
            }
        }
    },
    async recieve(recievement)
    {
        if (!recievement.commandRegisteror){return;}

         recievements.commandRegisteror=recievement.commandRegisteror;

    }
}