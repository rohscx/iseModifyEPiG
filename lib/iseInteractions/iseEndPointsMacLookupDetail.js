const {asyncRequest } = require('nodeutilz'); 
const generateMacIdGet = require('../generateMacIdGet.js');
const generateMacIdGetDetail = require('../generateMacIdGetDetail');
const Bottleneck =  require("bottleneck");
const cliProgress = require('cli-progress');
const _colors = require('colors');

module.exports = function ({payload,authData,metaData}){
    const {server,auth} =  authData;
    const limiter = new Bottleneck({
        maxConcurrent: 5,
        minTime: 600
      });
    const bar1 = new cliProgress.SingleBar({
        format: 'MAC ID Detail Lookup Progress |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    return new Promise (async (resolve, reject) => {
        // start the progress bar with a total value of 200 and start value of 0
        
        const newPayload = await Promise.all(payload.map(({id,name,link:{href}}, i) => {
            const payloadLength = payload.length;
            bar1.start(payloadLength, 0, {
                speed: "N/A"
            });
            const macIdUrl = `https://${server}/ers/config/endpoint/`;
            return  limiter.schedule(() => asyncRequest(generateMacIdGetDetail('GET',href,auth))
            .then(JSON.parse)
            .then(async (t) => {
                const {ERSEndPoint} = t;
                bar1.increment(); 
                if (payloadLength === i+1) bar1.stop();
                return ERSEndPoint;           
            })
            .catch(console.error));
        }))
    resolve({payload:newPayload,authData,metaData})
    })

}