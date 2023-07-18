"use strict";

module.exports.handler = async (event, context, callback) => {
  if (event.authorizationToken) {
    const authorizationHeader = event.authorizationToken;
    const encodedCredentials = authorizationHeader.split(" ")[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      "base64"
    ).toString("utf-8");
    const [username, password] = decodedCredentials.split(":");
    const githubAccountId = process.env.ClaudiaHdz23;

    if (password === githubAccountId) {
        callback(null, generatePolicy('user', 'Allow', event.methodArn));
    } else {
      console.log("ERROR!");
      callback(null, generatePolicy('user', 'Deny', event.methodArn));
    }
  } else {
    callback("Unauthorized");
  }
};

const generatePolicy = function(principalId, effect, resource) {
    const authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    return authResponse;
}
