'use strict';

const cheerio = require('cheerio');
const axios = require('axios');
const { flat } = require('../utils');

module.exports.hello = async event => {
    console.log("Hello from hello!");
    console.log(flat([1, 2, [3, 4]]));
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
