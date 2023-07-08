"use strict";
const AWS = require("aws-sdk");
const csv = require("csv-parser");
const s3 = new AWS.S3({ region: "us-east-1" });

module.exports.handler = async (event) => {
  try {
    for (const record of event.Records) {
      const bucket = process.env.S3_BUCKET_NAME;
      const key = record.s3.object.key;

      await processCSV(bucket, key);
      await copyObject(bucket, key);
      await deleteObject(bucket, key);
    }

    return {
      statusCode: 202,
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

const processCSV = (bucket, key) => {
  try {
    const results = [];
    const params = {
      Bucket: bucket,
      Key: key,
    };
    var s3Stream = s3.getObject(params).createReadStream();

    return new Promise((resolve, reject) => {
      s3Stream
      .pipe(csv())
      .on("data", function (data) {
        results.push(data);
      })
      .on("end", () => {
        console.log(results);
        resolve(results);
      })
      .on("error", (error) => {
        console.error("Error reading CSV file: ", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error on CSV: ", error);
  }
};

const copyObject = async (bucket, key) => {
  try {
    const params = {
      Bucket: bucket,
      CopySource: bucket + "/" + key,
      Key: key.replace("uploaded", "parsed"),
    };
    await s3.copyObject(params).promise();
    console.log("Object copied successfully.");
  } catch (error) {
    console.error("Error copying object:", error);
  }
};

const deleteObject = async (bucket, key) => {
  try {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    await s3.deleteObject(params).promise();
    console.log("Object deleted successfully.");
  } catch (error) {
    console.error("Error deleting object:", error);
  }
};
