const { types }=require('../../json/types.json');
const debugger_requests=require('../../utils/debugger');
const cooldowns=require('../../json/cooldowns.json');

async function connectionStateChanged(connection,oldState, newState){
    debugger_requests.sendRequest({type:types.DEBUG,content:[`Status updated ${oldState.status} -> ${newState.status}`]});
}

module.exports={connectionStateChanged}