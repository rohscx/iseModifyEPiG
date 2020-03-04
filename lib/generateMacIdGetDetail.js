module.exports = function(method, url, auth) {
  return {
    method,
    url: url,
    headers: {
      Accept: 'application/json',
      Authorization: auth,
      'Cache-Control': 'no-cache',
      'Accept-Encoding': 'gzip, deflate',
      Connection: 'keep-alive',
    },
  };
};
