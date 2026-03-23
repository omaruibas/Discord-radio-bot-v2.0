const { realStrings }=require('../json/RealStrings.json');
function translateString(str)
{
    let finalStr=str;
    for (const [string,translated] of Object.entries(realStrings))
    {
        finalStr=finalStr.replaceAll(string,translated);
    }
    return finalStr;
}

module.exports={translateString};