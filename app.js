
const caseIseTest = require('./lib/promps/caseIseTest.js');
const iseConnectionTest = require('./lib/iseInteractions/iseConnectionTest.js');
const iseEndPointsMacLookup = require('./lib/iseInteractions/iseEndPointsMacLookup.js');
const iseEndPointsEndpointUpdate = require('./lib/iseInteractions/iseEndPointsEndpointUpdate.js');
const metaDataUpdate = require('./lib/metaDataUpdate.js');
const LogGenerator = require('./lib/LogGenerator.js');
const data = require('./import/fciFacilities.json')


const dotenv = require('dotenv').config();
const iseAuth = process.env.ISE_AUTH;
const iseServer = process.env.ISE_SERVER;
const debugAndTest = true;


const what = new LogGenerator('deviceGroupUpdate',"payload",{debug:debugAndTest})
const {payload,groupId,description} = data;

iseConnectionTest(iseServer, iseAuth, {payload} ,false)
.then((t) => metaDataUpdate(t,{groupId,description,test:debugAndTest}))
.then(iseEndPointsMacLookup)
.then(iseEndPointsEndpointUpdate)
.then(what.log.bind(what))
.then(console.log)
.catch(console.error)