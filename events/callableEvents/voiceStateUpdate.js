const { AudioPlayerStatus }=require('@discordjs/voice');
const cooldowns=require("../../json/cooldowns.json")

const stoppingTimeouts=[];
async function cancelTimeouts()
{
    while(stoppingTimeouts.length>0)
    {
        const timeout=stoppingTimeouts.shift();
        timeout.close();
    }
}

async function voiceStateUpdate(client,connection,audioPlayer,oldState,newState){
    if(!connection){return;}

    const botChannel=await client.channels.cache.get(connection.joinConfig.channelId);
    const channel=newState.channel ?? oldState.channel;
    if (!channel || channel!==botChannel){return}

    const membersCount=channel.members.size;
    if (membersCount===1)
    {
        if (audioPlayer.getPlayerStatus()!==AudioPlayerStatus.Paused)
        {
            const timeout=setTimeout(()=>{
                audioPlayer.stop();
            },cooldowns.player_stopping);

            stoppingTimeouts.push(timeout);
        }
    }else if (membersCount>1)
    {
        await cancelTimeouts();
        console.log(audioPlayer.getPlayerStatus())
        if(audioPlayer.getPlayerStatus()!==AudioPlayerStatus.Playing)
        {
            setTimeout(async()=>{
                await audioPlayer.stop();
                await audioPlayer.play();
            },cooldowns.player_listening)
        }
    }
}
module.exports={
    voiceStateUpdate
}