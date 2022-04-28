import AWS from 'aws-sdk';
import createError from 'http-errors';

import baseMiddleware from '../middleware/baseMiddleware';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuction(event) {
  const {
    pathParameters: { id },
  } = event;
  let auction = null;

  try {
    const { Item } = await dynamoDB
      .get({ TableName: process.env.AUCTION_TABLE_NAME, Key: { id } })
      .promise();
    auction = Item;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID ${id} not found.`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = baseMiddleware(getAuction);
