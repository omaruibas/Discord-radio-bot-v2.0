const {PermissionsBitField}=require('discord.js');

const {connectRadio}=require('../functions/connectRadio');
const {tagged_messages}= require('../json/messages.json');

module.exports={
    data:{
        name:"connect-radio",
        description:"Connects to the voice you are in, and runs the radio."
    },
    perms:new PermissionsBitField(['ManageGuild']),
    async execute(interaction,client){
        const voiceChannel=interaction.member.voice.channel;
        try{
            const {message}=await connectRadio(client,voiceChannel);
            await interaction.editReply(tagged_messages[message].replace("{CHANNEL}",`<#${voiceChannel.id}>`));
        }catch(err){
            if (Object.hasOwn(tagged_messages,String(err.message).trim())){
                var reply;
                if (voiceChannel){
                    reply=tagged_messages[String(err.message).trim()].replace("{CHANNEL}",`<#${voiceChannel.id}>`);
                }else
                {
                    reply=tagged_messages[String(err.message).trim()];
                }
                await interaction.editReply(reply);
                return;
            }
            throw err;
        }
        
    }
}