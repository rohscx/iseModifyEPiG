const {asyncRequest } = require('nodeutilz'); 
const generateTestAuth = require('../generateTestAuth.js');
const gemerateGenericGet = require('../generateGenericGet.js');
const jsonParse = require('../jsonParse.js');
const addAuthData = require('../addAuthData.js');

module.exports = function (server,auth,macArray, debug = false){
    return new Promise ((resolve,reject) => {   
        asyncRequest(generateTestAuth('GET',null,auth,server))
        .then(jsonParse)
        .then((t) => {
            const {resources} = t.SearchResult;
            const links = resources.map(({id,name,link}) => link.href);
            // group is left out during the test.
            if(macArray) Promise.all(links.map((d) => asyncRequest(gemerateGenericGet('GET',d,auth,server))))
                        .then((t) => {if (debug)console.log(t.map((d) => JSON.parse(d)).map(({Node}) => ["Retrieved Server:",Node.name, Node.ipAddresses, Node.gateWay].join(' ')).join('\n'))});
            return t;
        })
        .then((t) => addAuthData(macArray,{server,auth}))
        .then(resolve)
        .catch(console.log)
        
        
        
    })
}