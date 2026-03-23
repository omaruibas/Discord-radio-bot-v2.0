const { Client,GatewayIntentBits }=require('discord.js');

const {SlashCommandManager}=require('./entities/SlashCommandManager');
const { token,debugMode }=require('./json/config.json').bot;
const { types } = require('./json/types.json');
const { connectEvents }=require('./functions/connectEvents');
const { whenSigint }=require('./events/callableEvents/processSigint');
const debugger_requests=require('./utils/debugger');


const client=new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildVoiceStates]});
const commandRegisteror=new SlashCommandManager(client);

connectEvents(client,commandRegisteror);
process.on("uncaughtException", (err) => {
  debugger_requests.sendRequest({type:types.ERROR,stack:err.stack,content:[`Uncaught Exception:`,err]});
});

process.on("unhandledRejection", (reason, promise) => {
  debugger_requests.sendRequest({type:types.WARN,stack:reason.stack,content:[`Uncaught Exception:`,reason]});
});

process.on("SIGINT",(...args)=>whenSigint(client,...args));

client.login(token);
