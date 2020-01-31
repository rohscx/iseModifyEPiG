const {asyncRequest } = require('nodeutilz'); 
const generateMacIdGet = require('../generateMacIdGet.js');
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
        format: 'MAC Lookup Progress |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    return new Promise (async (resolve) => {
        // start the progress bar with a total value of 200 and start value of 0
        
        const newPayload = await Promise.all(payload.map((macAddress, i) => {
            const payloadLength = payload.length;
            bar1.start(payloadLength, 0, {
                speed: "N/A"
            });
            const macIdUrl = `https://${server}/ers/config/endpoint/`;
            return  limiter.schedule(() => asyncRequest(generateMacIdGet('GET',macIdUrl,auth,macAddress))
            .then(JSON.parse)
            .then((t) => {
                const {SearchResult:{resources}} = t;
                const [index0] = resources;
                if (resources.length > 0) {
                    bar1.increment(); 
                    if (payloadLength === i+1) bar1.stop();
                    return index0;
                } else {
                    bar1.increment(); 
                    if (payloadLength === i+1) bar1.stop();
                    return {reject:macAddress};
                }
                
            })
            .catch(console.error));
        }));
    resolve({payload:newPayload,authData,metaData})
    })

}