const {asyncRequest } = require('nodeutilz'); 
const generateMacIdPut = require('../generateMacIdPut');
const Bottleneck =  require("bottleneck");

module.exports = function ({payload,authData,metaData}){
    const {server,auth} =  authData;
    const {groupId, description,test} = metaData;
    const limiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 600
      });

    const payloadLength = payload.filter((f) => f.reject).filter(({...rest}) => !rest.link).length;
 
    return new Promise (async (resolve,reject) => {
        if (payloadLength === 0) {
            return resolve({payload,authData,metaData});          
        }
        if (!test) {
  
        }
        const bar3 = metaData.multibar.create(payloadLength, 0, {
            barName: `MAC EPiG Update Progress (${metaData.barId})`,
            speed: "N/A"
        });
        const rejections = payload.filter((f) => f.reject);
        const newPayload = await Promise.all(payload.filter((f) => f.id).map( ({id,name,staticGroupAssignment,link:{href}},i) => {
            const macIdUrl =href;
            if (test) {
                return new Promise((resolve) => resolve(generateMacIdPut('PUT',macIdUrl,auth,groupId, description)))
                .catch(console.error);
            } else {
                return  limiter.schedule(() => {
                    bar3.increment(); 
                    //if (payloadLength === i+1) metaData.multibar.stop();
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