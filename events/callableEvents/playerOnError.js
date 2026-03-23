const debugger_requests=require('../../utils/debugger');
const {types}=require('../../json/types.json');

async function playerOnError(err){
    debugger_requests.sendRequest({type:types.ERROR,stack:err.stack,content:[err]});
    this.play.bind(this);
}

module.exports={playerOnError}