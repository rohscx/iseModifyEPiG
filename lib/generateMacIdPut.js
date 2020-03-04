module.exports = function(method, url, auth, groupId, description = '') {
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
    body: {
      ERSEndPoint: {
        description: description,
        groupId: groupId,
        staticGroupAssignment: true,
      },
    },
    json: true,
  };
};
