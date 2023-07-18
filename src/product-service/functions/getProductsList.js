"use strict";
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const scanDB = async (tableName) => {
  return await dynamoDB.scan({
    TableName: tableName
  }).promise();
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

module.exports.handler = async (event) => {
  try {
    const stockResult = await scanDB(process.env.STOCK);
    const productIds = stockResult.Items.map((item) => item.product_id);
    const productsResult = await dynamoDB.batchGet({
      RequestItems: {
        [process.env.PRODUCTS]: {
          Keys: productIds.map((id) => ({ id })),
        }
      }
    }).promise();

    const data = stockResult.Items.map((stockItem) => {
      const productItem = productsResult.Responses.products.find((product) => product.id === stockItem.product_id);
      return {
        ...productItem,
        count: stockItem.count,
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while obtaining data' }),
    };
  }

};
