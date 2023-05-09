"use strict";
const productList = require('../assets/products.json');

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(productList),
  };
};
