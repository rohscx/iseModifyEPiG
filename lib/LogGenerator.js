const {writeFile} = require('nodeutilz');
module.exports = class {
    constructor(logName,dataKey,config) {
        const {debug} = config || {debug:false};
        this.logName = logName;
        this.dataKey = dataKey;
        this.debug = debug
    }
    test(data) {
        return console.log(this.dataKey)
    }
    log(data) {
        if (this.debug) return console.log(JSON.stringify(data,null,'\t'))
        if (data.then) {
            const promiseLog = log;
            return promiseLog.then((t) => writeFile(`./logs/${this.logName}_${Date.now()}.json`,JSON.stringify(t,null,'\t'),'utf8')).catch(console.error) ;
        } else {
            return writeFile(`./logs/${this.logName}_${Date.now()}.json`,JSON.stringify(data[this.dataKey],null,'\t'),'utf8').catch(console.error);
        } 
    }
}



// async function (log,logName){
//     if (log.then) {
//         const promiseLog = await log;
//         return writeFile(`./logs/${logName}_${Date.now()}.json`,JSON.stringify(promiseLog,null,'\t'),'utf8');
//     } else {
//         return writeFile(`./logs/${logName}_${Date.now()}.json`,JSON.stringify(log,null,'\t'),'utf8');
//     } 
// }