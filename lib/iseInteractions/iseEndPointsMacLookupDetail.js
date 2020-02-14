const {asyncRequest } = require('nodeutilz'); 
const generateMacIdGetDetail = require('../generateMacIdGetDetail');
const Bottleneck =  require("bottleneck");


module.exports = function ({payload,authData,metaData}){
    const {server,auth} =  authData;
    const limiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 600
      });


    const payloadLength = payload.filter(({...rest}) => !rest.link).length;
    const bar2 = metaData.multibar.create(payloadLength, 0, {
        barName: `MAC ID Detail Lookup Progress (${metaData.barId})`,
        speed: "N/A"
    });

    return new Promise (async (resolve, reject) => {
        // start the progress bar with a total value of 200 and start value of 0
        
        const newPayload = await Promise.all(payload.map(({id,name,...rest}, i) => {
            // const payloadLength = payload.length;

            if (!rest.link) {
                const reject = {ERSEndPoint:{id,name,...rest}};
                metaData.rejects.push(reject);
                return JSON.stringify(reject);
            }
            const macIdUrl = `https://${server}/ers/config/endpoint/`;
            return  limiter.schedule(() => asyncRequest(generateMacIdGetDetail('GET',rest.link.href,auth))
            .then(JSON.parse)
            .then(async (t) => {
                const {ERSEndPoint} = t;
                bar2.increment(); 
                //if (payloadLength === i+1) bar2.stop();
                return ERSEndPoint;           
            })
            .catch(console.error));
        }))
    resolve({payload:newPayload,authData,metaData})
    })

}