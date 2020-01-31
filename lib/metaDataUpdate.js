module.exports = function (data,udpate){
    return new Promise ((resolve,reject) => {
        resolve({...data,metaData:udpate})
    })
}