
const caseIseTest = require('./lib/promps/caseIseTest.js');
const iseConnectionTest = require('./lib/iseInteractions/iseConnectionTest.js');
const iseEndPointsMacLookup = require('./lib/iseInteractions/iseEndPointsMacLookup.js');
const iseEndPointsMacLookupDetail = require('./lib/iseInteractions/iseEndPointsMacLookupDetail.js');
const iseEndPointsEndpointUpdate = require('./lib/iseInteractions/iseEndPointsEndpointUpdate.js');
const metaDataUpdate = require('./lib/metaDataUpdate.js');
const LogGenerator = require('./lib/LogGenerator.js');
const data = require('./import/fciFacilities.json');
const {objectKeyFilter,dirContents,readFile} = require("nodeutilz");
const cliProgress = require('cli-progress');
const _colors = require('colors');


const dotenv = require('dotenv').config();
const iseAuth = process.env.ISE_AUTH;
const iseServer = process.env.ISE_SERVER;
const debugAndTest = false;


const multibar = new cliProgress.MultiBar({
    format: '{barName} |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});
const what = new LogGenerator('deviceGroupUpdate',"applog",{debug:debugAndTest});


return dirContents('./import/bulkJson')
.then((t) => Promise.all(t.map((d) => readFile(`./import/bulkJson/${d}`))))
.then((t) => Promise.all(t.map((d) => JSON.parse(d))))
.then((t) => {
    return Promise.all(t.map(({payload,groupId,description}) => {
        
        return iseConnectionTest(iseServer, iseAuth, {payload} ,false)
        .then((t) => metaDataUpdate(t,{groupId,description,test:debugAndTest,rejects:[],multibar,barId:description}))
        .then(iseEndPointsMacLookup)
        .then(iseEndPointsMacLookupDetail)
        .then(iseEndPointsEndpointUpdate)
        .then(({payload,metaData}) => ({applog:{"payload":payload, metaData}}))
        .then(what.log.bind(what))
        //.then(console.log)
        .catch(console.error)
    }))
})
//.then(console.log)
.catch(console.log)

// iseEndPointsMacLookupDetail
// const dotenv = require('dotenv').config();
// const iseAuth = process.env.ISE_AUTH;
// const iseServer = process.env.ISE_SERVER;
// const debugAndTest = false;


// const what = new LogGenerator('deviceGroupUpdate',"applog",{debug:debugAndTest})
// const {payload,groupId,description} = data;

// iseConnectionTest(iseServer, iseAuth, {payload} ,false)
// .then((t) => metaDataUpdate(t,{groupId,description,test:debugAndTest}))
// .then(iseEndPointsMacLookup)
// .then(iseEndPointsMacLookupDetail)
// .then(iseEndPointsEndpointUpdate)
// .then(({payload,metaData}) => ({applog:{"payload":payload, metaData}}))
// .then(what.log.bind(what))
// .then(console.log)
// .catch(console.error)