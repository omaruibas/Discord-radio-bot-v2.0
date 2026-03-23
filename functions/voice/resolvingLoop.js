const { getVoiceConnection,AudioPlayerStatus,VoiceConnectionStatus }=require('@discordjs/voice');

const { getAudioPlayerForGuild,destroyAudioPlayerForGuild }=require('./audioPlayers');
const { connectRadio }=require('../connectRadio')
const cooldowns=require('../../json/cooldowns.json')

async function resolvingLoop(client)
{
    async function resolve()
    {
        
        for (const [guildId,guild] of client.guilds.cache)
        {
            let connection=await getVoiceConnection(guildId);
            if(connection.state.status!==VoiceConnectionStatus.Ready){
                connection.destroy();

                const channelId=connection.joinConfig.channelId
                if (channelId)
                {
                    const channel = client.channels.cache.get(channelId) || await client.channels.fetch(channelId);
                    if(channel)
                    {
                        connectRadio(client,channel);
                        connectedRadio=true;
                    }
                }
                continue;
            }
            const audioPlayer=await getAudioPlayerForGuild(guild);
            if (audioPlayer.getPlayerStatus()!==AudioPlayerStatus.Playing){
                await destroyAudioPlayerForGuild(guild);
                const newAudioPlayer=await getAudioPlayerForGuild(guild);
                await newAudioPlayer.subscribeConnection(connection)
                await newAudioPlayer.play();
            }
        }
    }
    await resolve();
    setInterval(resolve,cooldowns.resolving_loop);
}

module.exports={resolvingLoop}