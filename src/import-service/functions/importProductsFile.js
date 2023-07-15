"use strict";
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

module.exports.handler = async (event) => {
  try {
    const { name } = event.queryStringParameters;
    const bucket = process.env.S3_BUCKET_NAME;

    const params = {
      Bucket: bucket,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: "text/csv",
    };
    const signedUrl = s3.getSignedUrl("putObject", params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(signedUrl),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while generating the url.",
      }),
    };
  }
};
