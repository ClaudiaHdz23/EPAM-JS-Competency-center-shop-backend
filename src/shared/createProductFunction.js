"use strict";
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

module.exports.createProduct = async (product) => {
  try {
    const id = uuidv4();
    product['id'] = id;

    const newProduct = {
      id,
      title: product.title,
      description: product.description,
      price: product.price,
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
        Item: { product_id: id, count: product.count },
      })
      .promise();

    return { productResult, stockResult };
  } catch (error) {
    return error;
  }
};
