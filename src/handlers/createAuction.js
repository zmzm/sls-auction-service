import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

import { AUCTION_STATUS } from '../constants';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event) {
  const { name } = JSON.parse(event.body);
  const now = new Date();

  const auction = {
    id: uuid(),
    name,
    status: AUCTION_STATUS.open,
    createdAt: now.toISOString(),
  };

  await dynamoDB
    .put({
      TableName: 'AuctionTable',
      Item: auction,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;
