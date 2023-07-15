"use strict";
const { createProduct } = require("src/shared/createProductFunction");
const AWS = require("aws-sdk");
const sns = new AWS.SNS({ region: 'us-east-1' });

module.exports.handler = async (event) => {
  try {
    for (const { body } of event.Records) {
      const message = JSON.parse(body);
      const topicArn = process.env.ARN_SNS;

      if (message.length) {
        for (const item of message) {
          const productRes = await createProduct(item);
        }
      }

      const params = {
        Subject: 'New product was created',
        TopicArn: topicArn,
        Message: JSON.stringify({
          description: "A new product was created here you have the data",
          items: message
        }),
      };
      sns.publish(params, () => {
        console.log("Message sent.");
      });
    }

    console.log("Processing completed");
    return {
      statusCode: 200,
      body: "Processing completed",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error,
      }),
    };
  }
};
