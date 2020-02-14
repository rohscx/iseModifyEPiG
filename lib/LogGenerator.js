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
            const data0 = JSON.stringify(t,null,'\t');
            return promiseLog.then((t) => writeFile(`./logs/${this.logName}_${Date.now()}.json`,data0,'utf8')).catch(console.error) ;
        } else {
            const data1 = data[this.dataKey];
            /*
                https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#Examples
            */
            const getCircularReplacer = () => {
                const seen = new WeakSet();
                return (key, value) => {
                  if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) {
                      return;
                    }
                    seen.add(value);
                  }
                  return value;
                };
              };
            return writeFile(`./logs/${this.logName}_${Date.now()}.json`,JSON.stringify(data1,getCircularReplacer(),'\t'),'utf8').catch(console.error);
        } 
    }
}

