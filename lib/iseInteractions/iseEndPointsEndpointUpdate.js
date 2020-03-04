const {asyncRequest } = require('nodeutilz'); 
const generateMacIdPut = require('../generateMacIdPut');

module.exports = function ({payload,authData,metaData}){
    const {server,auth} =  authData;
    const {groupId, description,test, limiter} = metaData;


    const payloadLength = payload.filter((f) => f.id).filter(({staticGroupAssignment}) => staticGroupAssignment === false).length;
 
    return new Promise (async (resolve,reject) => {
        // if (payloadLength === 0) {
        //     console.log("skip",payload)
        //     return resolve({payload,authData,metaData});          
        // }
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
                return  limiter.key(groupId).schedule(() => {
                    
                    //if (payloadLength === i+1) metaData.multibar.stop();
                    if (staticGroupAssignment) {
                        return generateMacIdPut('PUT',macIdUrl,auth,groupId, description);
                    } else {
                        bar3.increment(); 
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