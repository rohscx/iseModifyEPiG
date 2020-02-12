
const caseIseTest = require('./lib/promps/caseIseTest.js');
const iseConnectionTest = require('./lib/iseInteractions/iseConnectionTest.js');
const iseEndPointsMacLookup = require('./lib/iseInteractions/iseEndPointsMacLookup.js');
const iseEndPointsMacLookupDetail = require('./lib/iseInteractions/iseEndPointsMacLookupDetail.js');
const iseEndPointsEndpointUpdate = require('./lib/iseInteractions/iseEndPointsEndpointUpdate.js');
const metaDataUpdate = require('./lib/metaDataUpdate.js');
const LogGenerator = require('./lib/LogGenerator.js');
const data = require('./import/fciFacilities.json');
const {objectKeyFilter} = require("nodeutilz");

iseEndPointsMacLookupDetail
const dotenv = require('dotenv').config();
const iseAuth = process.env.ISE_AUTH;
const iseServer = process.env.ISE_SERVER;
const debugAndTest = false;


const what = new LogGenerator('deviceGroupUpdate',"applog",{debug:debugAndTest})
const {payload,groupId,description} = data;

iseConnectionTest(iseServer, iseAuth, {payload} ,false)
.then((t) => metaDataUpdate(t,{groupId,description,test:debugAndTest}))
.then(iseEndPointsMacLookup)
.then(iseEndPointsMacLookupDetail)
.then(iseEndPointsEndpointUpdate)
.then(({payload,metaData}) => ({applog:{"payload":payload, metaData}}))
.then(what.log.bind(what))
.then(console.log)
.catch(console.error)