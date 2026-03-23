const { makeConnection,isConnected }=require('./voice/connections');
const playerToConnectionConnector=require('./voice/playerToConnectionConnector');

async function connectRadio(client,voiceChannel)
{
    if(!voiceChannel){throw new Error("NOT_CONNECTED_TO_VOICE");}

    const guild=voiceChannel.guild;
    const {oldConnection}=await isConnected(guild);
    if(oldConnection){return {connection:oldConnection,message:"ALREADY_CONNECTED_TO_VOICE"};}

    const {connection}=await makeConnection(voiceChannel);
    if(!connection){throw new Error("CONNECTION_ISSUE");}
    playerToConnectionConnector.connect(client,connection);
    return {connection:connection,message:"DONE_CONNECT_TO_VOICE"}
}

module.exports={connectRadio}