module.exports = function (method,url,auth,macAddresss){
    return  {
        method,
        'url': url,
        'qs': { filter: `mac.CONTAINS.${macAddresss}` },
        'headers': {
          'Accept': 'application/json',
          'Authorization':auth,
          'Cache-Control': 'no-cache',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        }
      };
}