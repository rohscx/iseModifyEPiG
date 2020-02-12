const {asyncRequest } = require('nodeutilz'); 
const generateMacIdPut = require('../generateMacIdPut');
const Bottleneck =  require("bottleneck");
const cliProgress = require('cli-progress');
const _colors = require('colors');

module.exports = function ({payload,authData,metaData}){
    const {server,auth} =  authData;
    const {groupId, description,test} = metaData;
    const limiter = new Bottleneck({
        maxConcurrent: 5,
        minTime: 600
      });
    const bar1 = new cliProgress.SingleBar({
        format: 'MAC EPiG Update Progress |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    return new Promise (async (resolve) => {
        // lets pick this up in the morning!!!
        const payloadLength = payload.filter((f) => f.id).length;
        if (!test) {
            bar1.start(payloadLength, 0, {
                speed: "N/A"
            });
        }
        const rejections = payload.filter((f) => f.reject);
        const newPayload = await Promise.all(payload.filter((f) => f.id).map( ({id,name,staticGroupAssignment,link:{href}},i) => {
            const macIdUrl =href;
            if (test) {
                return new Promise((resolve) => resolve(generateMacIdPut('PUT',macIdUrl,auth,groupId, description)))
                .catch(console.error);
            } else {
                return  limiter.schedule(() => {
                    bar1.increment(); 
                    if (payloadLength === i+1) bar1.stop();
                    if (staticGroupAssignment) {
                        return generateMacIdPut('PUT',macIdUrl,auth,groupId, description);
                    } else {
                        return asyncRequest(generateMacIdPut('PUT',macIdUrl,auth,groupId, description))
                        .catch(console.error);
                    }
                });
            }

        }));
    if (newPayload.length > 0) {
        resolve({payload:[...newPayload,...rejections],authData,metaData})
    } else {
        resolve({payload:newPayload,authData,metaData})
    }
    
    })

}