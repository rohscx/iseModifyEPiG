const {asyncRequest } = require('nodeutilz'); 
const generateMacIdGetDetail = require('../generateMacIdGetDetail');

module.exports = function ({payload,authData,metaData}){
    const {server,auth} =  authData;
    const {limiter} = metaData;

    const payloadLength = payload.filter((f) => !f.reject).filter(({...rest}) => !rest.link).length;


    return new Promise (async (resolve, reject) => {
        // start the progress bar with a total value of 200 and start value of 0
        if (payloadLength === 0) {
            return resolve({payload,authData,metaData});          
        }
        const bar2 = metaData.multibar.create(payloadLength, 0, {
            barName: `MAC ID Detail Lookup Progress (${metaData.barId})`,
            speed: "N/A"
        });
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