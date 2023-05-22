"use strict";
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const { productId } = event.pathParameters;    
    const productResult = await dynamoDB.get({
      TableName: process.env.PRODUCTS,
      Key: {id: productId},
    }).promise();

    if (productResult.Item) {
      const stockResult = await dynamoDB.get({
        TableName: process.env.STOCK,
        Key: {product_id: productId},
      }).promise();

      if (!stockResult.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'An error was generated while getting the product info' }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          ...productResult.Item,
          count: stockResult.Item.count
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Invalid productId' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while obtaining data' }),
    };
  }
};
