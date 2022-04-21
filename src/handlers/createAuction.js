import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

import { AUCTION_STATUS } from '../constants';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event) {
  const {
    body: { name },
  } = event;
  const now = new Date();

  const auction = {
    id: uuid(),
    name,
    status: AUCTION_STATUS.open,
    createdAt: now.toISOString(),
  };

  try {
    await dynamoDB
      .put({
        TableName: process.env.AUCTION_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
