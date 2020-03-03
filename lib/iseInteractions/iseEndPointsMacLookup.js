const {asyncRequest } = require('nodeutilz'); 
const generateMacIdGet = require('../generateMacIdGet.js');
const generateMacIdGetDetail = require('../generateMacIdGetDetail');



module.exports = function ({payload,authData,metaData}){
    const {server,auth} =  authData;
    const {limiter} = metaData;

    const payloadLength = payload.length;
    const bar1 = metaData.multibar.create(payloadLength, 0);
    //bar1.start(payloadLength, 0);
    bar1.update(0, {
        barName: `MAC ID Lookup Progress (${metaData.barId})`,
        speed: "N/A"
    });

    return new Promise (async (resolve, reject) => {
        // start the progress bar with a total value of 200 and start value of 0
        
        const newPayload = await Promise.all(payload.map((macAddress, i) => {
            
            const macIdUrl = `https://${server}/ers/config/endpoint/`;
            return  limiter.schedule(() => asyncRequest(generateMacIdGet('GET',macIdUrl,auth,macAddress))
            .then(JSON.parse)
            .then(async (t) => {
                const {SearchResult:{resources}} = t;
                const [index0] = resources;
                if (resources.length > 0) {
                    bar1.increment(); 
                    //if (payloadLength === i+1) bar1.stop();
                    const detailedResult =  await asyncRequest(generateMacIdGetDetail('GET',index0.link.href,auth)).then(JSON.parse);
                    const {id,name,description,mac,profileId,staticProfileAssignment,groupId,staticGroupAssignment,portalUser,identityStoreidentityStoreId,link} = detailedResult.ERSEndPoint
                    return {id,name,description,mac,profileId,staticProfileAssignment,groupId,staticGroupAssignment,portalUser,identityStoreidentityStoreId,link};
                } else {
                    bar1.increment(); 
                    //if (payloadLength === i+1) bar1.stop();
                    return {reject:macAddress};
                }
                
            })
            .catch(console.error));
        }))
    resolve({payload:newPayload,authData,metaData})
    })

}