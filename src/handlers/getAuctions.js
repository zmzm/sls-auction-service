import AWS from 'aws-sdk';
import createError from 'http-errors';

import baseMiddleware from '../middleware/baseMiddleware';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions() {
  try {
    const { Items } = await dynamoDB
      .scan({ TableName: process.env.AUCTION_TABLE_NAME })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export const handler = baseMiddleware(getAuctions);
