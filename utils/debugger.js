const fs=require('fs/promises');

const {debugMode}=require('../json/config.json').bot;
const {types}=require('../json/types.json');

let handlingRequests=false;
const requests=[];

function handleRequests() {
    handlingRequests = true;

    while (requests.length > 0) {
        const request = requests.shift();
        if (!debugMode && (request.type === types.ERROR || request.type === types.WARN || request.type===types.DEBUG)) {continue;}
        if (request.type!==types.NORMAL){console.log(`\n[==== ${request.type} ====]\n`,request.stack);}
        if (request.type===types.ERROR)
        {
            console.error("\n",...request.content);
        }else if(request.type===types.WARN)
        {
            console.warn("\n",...request.content);
        }else if (request.type==types.NORMAL||request.type==types.DEBUG)
        {
            console.log(`\n[ ${request.type} ] `,...request.content);
        }
        if(request.stack)
        {
            console.log("\n[==== DETAILS ====]\n",request.stack);
        }
    }

    handlingRequests = false;
}

function sendRequest(request)
{
    requests.push(request);
    if(handlingRequests){return;}
    handleRequests();
}

module.exports={sendRequest};