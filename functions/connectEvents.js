const fs=require('fs');
const path=require('path');
const eventPath=path.join(__dirname,'..',"events");
const eventFiles=fs.readdirSync(eventPath).filter(f=>f.endsWith("js"));

async function connectEvents(client,commandRegisteror)
{
    for (const file of eventFiles)
    {
        const requirement=require(`${eventPath}/${file}`);
        if(requirement.recieve)
        {
            requirement.recieve({client,commandRegisteror});
        }
        if (requirement.once==false)
        {
            client.on(requirement.event,(...args)=>requirement.execute(client.commands,client,...args));
        }else{
            client.once(requirement.event,(...args)=>requirement.execute(client.commands,client,...args));
        }
    }
}   

module.exports={connectEvents}