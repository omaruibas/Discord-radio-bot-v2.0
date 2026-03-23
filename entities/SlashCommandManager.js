const fs=require('fs');
const path=require("path");
const { REST,Routes, Collection } = require("discord.js");

const { token,clientID } = require("../json/config.json").bot;
const { types }=require('../json/types.json');
const cooldowns=require('../json/cooldowns.json');
const debugger_requests=require('../utils/debugger');

class SlashCommandManager{
    constructor(client){
        this.registeredGuilds=[];
        this.commands_path=path.join(__dirname,'..',"commands");
        this.restConnection= new REST({ version: "10", timeout:30000 }).setToken(token);

        client.commands=new Collection();
        this.client=client;
        
        this.storeCommands(client.commands);
    };

    storeCommands(collection)
    {
        const commandFilesArray= fs.readdirSync(this.commands_path);
        for (const file of commandFilesArray)
        {
            const requirement=require(path.join(this.commands_path,file));
            
            collection.set(requirement.data.name,requirement);
        }
    }

    getCommands(the_path)
    {
        const commands = [];
        const commandFilesList = fs.readdirSync(the_path).filter(file => file.endsWith(".js"));

        for (const commandFile of commandFilesList) {
            const commandFileRequirement = require(path.join(the_path,commandFile));
            commands.push(commandFileRequirement.data);
        }

        return commands
    };

    async registerCommandsToGuild(guild)
    {
        if(this.registeredGuilds.includes(guild.id)){return;}
        const commands=this.getCommands(this.commands_path);
        
        try {
            debugger_requests.sendRequest({type:types.NORMAL,content:["Started refreshing application (/) commands."]});

            await this.restConnection.put(
                Routes.applicationGuildCommands(clientID, guild.id),
                { body: commands }
            );

            this.registeredGuilds.push(guild.id);
            debugger_requests.sendRequest({type:types.NORMAL,content:["Started refreshing application (/) commands."]});
        } catch (error) {
                debugger_requests.sendRequest({type:types.ERROR,stack:error.stack,content:[error]});
            setTimeout(()=>{this.registerCommandsToGuild(guild)},cooldowns.retry_registeration)
        }
        
    }
}




module.exports={SlashCommandManager};