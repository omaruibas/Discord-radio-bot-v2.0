const {getVoiceConnection}=require('@discordjs/voice');
const {PermissionsBitField}=require('discord.js');

const {destroyConnection}=require('../functions/voice/connections.js');
const {tagged_messages}= require('../json/messages.json');

module.exports={
    data:{
        name:"disconnect-radio",
        description:"Disconnects the radio."
    },
    perms:new PermissionsBitField(['ManageGuild']),
    async execute(interaction,client)
    {
        const guild=interaction.guild;
        const connection=getVoiceConnection(guild.id);
        if(!connection){throw new Error("ALREADY_NOT_CONNECTED_TO_VOICE");}
        const {result,channelId}=await destroyConnection(connection);
        await interaction.editReply(tagged_messages[result].replace("{CHANNEL}",`<#${channelId}>`));
    }
}