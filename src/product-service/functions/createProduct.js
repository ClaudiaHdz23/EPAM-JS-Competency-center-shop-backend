"use strict";
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    if (!body.title || !body.price || !body.count) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Product data is invalid' }),
      };
    }

    const id = uuidv4();

    const newProduct = {
        id,
        title: body.title,
        description: body.description,
        price: body.price,
    };
    const productResult = await dynamoDB
      .put({
        TableName: process.env.PRODUCTS,
        Item: newProduct,
        ReturnValues: "ALL_OLD",
      })
      .promise();

    const stockResult = await dynamoDB
      .put({
        TableName: process.env.STOCK,
        Item: {product_id: id, count: body.count},
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ ...body, id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error was generated while saving product information' }),
    };
  }
};
