const { Events }=require('discord.js')

const { commandCooldownManager }=require('../entities/commandsCooldownManager.js');
const debugger_requests=require('../utils/debugger.js');
const { types }=require('../json/types.json');
const realStrings=require('../utils/realStrings.js');
const {tagged_messages,general_error_message}=require('../json/messages.json');

const cooldownManager=new commandCooldownManager();

module.exports={
    event:Events.InteractionCreate,
    once:false,
    async execute(commandsCollection,client,interaction)
    {
        await interaction.deferReply();
        if (interaction.isChatInputCommand()){
            try{
                if(!commandsCollection.get(interaction.commandName)){throw new Error("UNKNOWN");}
                if (!cooldownManager.canUse(interaction.commandName,interaction.guild.id)){throw new Error("WAIT_COOLDOWN");}
                cooldownManager.setTime(interaction.commandName,interaction.guild.id);
                if (!interaction.member.permissions.has(commandsCollection.get(interaction.commandName).perms)){
                    const permsString=realStrings.translateString(this.perms.toArray().join(', '));

                    await interaction.editReply(tagged_messages.MISSING_PERMISSIONS.replace("{PERMISSIONS}",permsString));
                    return;
                }  
                await commandsCollection.get(interaction.commandName).execute(interaction,client);
            }catch(error)
            {
                debugger_requests.sendRequest({type:types.ERROR,stack:error.stack,content:[error]});
                if(Object.hasOwn(tagged_messages,String(error.message).trim())){
                    await interaction.editReply(tagged_messages[String(error.message).trim()].replace('{TIME}',String(cooldownManager.getRemainingTime(interaction.commandName,interaction.guild.id))));
                    return;
                };
                await interaction.editReply(general_error_message);
            }  
            return;
        }

    }
}