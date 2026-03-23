const { joinVoiceChannel,getVoiceConnection }=require('@discordjs/voice');

const { connectionStateChanged }=require('../../events/callableEvents/connectionStateChange');

async function makeConnection(voiceChannel)
{
    if(!voiceChannel){throw new Error("FAILED")}

    const GUILD_ID=voiceChannel.guild.id;
    const CHANNEL_ID=voiceChannel.id;
    const ADAPTER_CREATOR=voiceChannel.guild.voiceAdapterCreator;
    const permissions=voiceChannel.permissionsFor(voiceChannel.guild.members.me);

    if (!permissions.has("Connect")){throw new Error("NO_PERMISSION_TO_CONNECT")}
    if (!permissions.has("Speak")){throw new Error("NO_PERMISSION_TO_SPEAK")}

    const connection = joinVoiceChannel({
        channelId: CHANNEL_ID,           
        guildId: GUILD_ID,       
        adapterCreator: ADAPTER_CREATOR,
        selfMute: false,
        selfDeaf:true
    });

    connection.on('stateChange', (...args)=>connectionStateChanged(connection,...args));
    return {connection:connection,message:"DONE_CONNECT_TO_VOICE"};
}

async function destroyConnection(connection)
{
    if(!connection){return;}
    connection.destroy();
    return {result:"DONE_DISCONNECT_FROM_VOICE",channelId:connection.joinConfig.channelId};
}

async function isConnected(guild)
{
    const connection=getVoiceConnection(guild.id);
    if(connection){return {oldConnection:connection};}
    return {oldConnection:null};
}

module.exports={makeConnection,destroyConnection,isConnected}