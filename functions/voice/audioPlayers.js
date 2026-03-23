const { Collection }=require('discord.js');

const { Player }=require('../../entities/player');
const { streamingURL }=require('../../json/config.json').radio;

const audioPlayers=new Collection();

async function getAudioPlayerForGuild(guild)
{
    if (audioPlayers.get(guild.id)){return audioPlayers.get(guild.id);}
    const audioPlayer=new Player(streamingURL);
    audioPlayers.set(guild.id,audioPlayer);

    return audioPlayer;
}

async function destroyAudioPlayerForGuild(guild)
{
    if(!audioPlayers.get(guild.id)){return;}
    audioPlayers.delete(guild.id);
}

module.exports={getAudioPlayerForGuild,destroyAudioPlayerForGuild}