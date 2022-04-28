import AWS from 'aws-sdk';
import createError from 'http-errors';

import baseMiddleware from '../middleware/baseMiddleware';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function placeBid(event) {
  const {
    pathParameters: { id },
  } = event;
  const { amount } = event.body;
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  };
  let updatedAuction = null;

  try {
    const { Attributes } = await dynamoDB.update(params).promise();
    updatedAuction = Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = baseMiddleware(placeBid);
