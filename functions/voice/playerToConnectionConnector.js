const {VoiceConnectionStatus,entersState}=require('@discordjs/voice');

const { voiceStateUpdate }=require('../../events/callableEvents/voiceStateUpdate');
const { getAudioPlayerForGuild }=require('./audioPlayers');

const oldListeners=[];

async function connect(client,connection)
{
    if (!connection){return;}
    try{await entersState(connection, VoiceConnectionStatus.Ready, 20000);}catch(err){throw new Error("CONNECTION_ISSUE")}
    if (connection.state.status!==VoiceConnectionStatus.Ready){throw new Error("CONNECTION_NOT_READY")}
    const guild = await client.guilds.cache.get(connection.joinConfig.guildId);
    const audioPlayer=await getAudioPlayerForGuild(guild);
    const voiceStateUpdateListeners=client.listeners("voiceStateUpdate");
    const voiceStateUpdateWithConnection=(...args)=>voiceStateUpdate(client,connection,audioPlayer,...args);
    oldListeners.push(voiceStateUpdateWithConnection);
    if(!audioPlayer){return "FAILED";}
    await audioPlayer.subscribeConnection(connection);
    await audioPlayer.play();

    for (const listener of oldListeners)
    {
        if (voiceStateUpdateListeners.includes(listener))
        {
            client.off("voiceStateUpdate",listener);
        }
    }
        
    client.on("voiceStateUpdate",voiceStateUpdateWithConnection);

    connection.on(VoiceConnectionStatus.Destroyed,async ()=>{
        await audioPlayers.destroyAudioPlayerForGuild(guild);
    });

}

module.exports={connect};