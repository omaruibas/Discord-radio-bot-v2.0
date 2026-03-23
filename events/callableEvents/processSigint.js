const { getVoiceConnection }=require('@discordjs/voice')

function whenSigint(client,signal)
{
    try{
        client.guilds.cache.forEach(
        guild => { 
            const connection = getVoiceConnection(guild.id);
            if (connection)
            { 
                connection.destroy();
            } 
        });
    }catch(err)
    {
        console.log(err);
    }finally
    {
        process.exit(0);
    }
}

module.exports={whenSigint}