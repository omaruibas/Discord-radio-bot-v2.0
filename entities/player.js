const { createAudioPlayer,AudioPlayerStatus,createAudioResource,StreamType }=require('@discordjs/voice');
const prism=require('prism-media');

const { playerOnError }=require('../events/callableEvents/playerOnError')
const cooldowns=require('../json/cooldowns.json')

class Player
{
    #currentPlayer;
    #subscribers=[];
    #oldSubscriptions=[];

    constructor(URL)
    {
        this.#initPlayer();
        this.URL=URL;
    }

    async #initPlayer()
    {
        this.#currentPlayer = await this.#makeAudioPlayer();
    }

    async #makeAudioPlayer()
    {
        if(this.#currentPlayer){this.#currentPlayer.stop();this.#currentPlayer.removeAllListeners();}
        const player=createAudioPlayer();
        
        player.on(AudioPlayerStatus.Idle,()=>this.play);
        player.on('error',playerOnError)
        return player
    }

    async getResource(URL)
    {
        if(!URL){return;}
        const ffmpeg = new prism.FFmpeg({
            args: [
                '-reconnect', '1',
                '-reconnect_streamed', '1',
                '-reconnect_delay_max', '5',
                '-i', URL,
                '-analyzeduration', '0',
                '-loglevel', '0',
                '-vn',
                '-f', 'opus',
                '-ar', '48000',
                '-ac', '2',
                '-b:a', '48k'
            ]
        });
        
                
        const resource = await createAudioResource(ffmpeg, {
            inputType: StreamType.OggOpus
        });
        return resource;
    }


    async #reconnectSubscribers()
    {
        if (!this.#currentPlayer){return;}
        while (this.#oldSubscriptions.length>0)
        {
            const subscription=this.#oldSubscriptions.shift();
            subscription.unsubscribe();
        }

        for (const connection of this.#subscribers)
        {
            const subscription=connection.subscribe(this.#currentPlayer);
            this.#oldSubscriptions.push(subscription);
        }
    }

    getPlayerStatus()
    {
        return this.#currentPlayer.state.status;
    }
    
    async subscribeConnection(connection)
    {
        if(this.#subscribers.includes(connection)){return;}
        const length=this.#subscribers.push(connection);
        const connectionNumber=length-1;
        
        connection.on('destroyed',async ()=>{await this.unsubscribeConnection(connectionNumber)});
        connection.on('disconnected',async ()=>{await this.unsubscribeConnection(connectionNumber)});

        await this.#reconnectSubscribers();
        return connectionNumber;
    }

    async unsubscribeConnection(connectionNumber)
    {
        if(!this.#subscribers[connectionNumber]){return;}
        this.#subscribers.splice(connectionNumber,1);

        await this.#reconnectSubscribers();
    }

    async play()
    {
        if (!this.#currentPlayer){return;}
        const resource=await this.getResource(this.URL);
        if (!resource){return;}

        this.#currentPlayer.stop();
        setTimeout(()=>{
            this.#currentPlayer.play(resource);
        },cooldowns.player_listening);
    }

    async stop()
    {
        this.#currentPlayer.stop();
    }
}

module.exports={Player}