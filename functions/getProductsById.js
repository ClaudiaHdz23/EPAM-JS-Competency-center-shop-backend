"use strict";
const productList = require("../assets/products.json");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

module.exports.handler = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const element = productList.find((element) => element.id === productId);
    if (!element) {
      throw new Error(`Invalid productId`);
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(element),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: `Invalid productId` }),
    };
  }
};
