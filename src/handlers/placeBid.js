import createError from 'http-errors';

import baseMiddleware from '../middleware/baseMiddleware';
import AuctionRepository from '../repositories/auctionRepository';

const auctionRepository = new AuctionRepository();

async function placeBid(event) {
  const {
    pathParameters: { id },
  } = event;
  const { amount } = event.body;
  const params = {
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  };
  let updatedAuction = null;

  try {
    const result = await auctionRepository.update(params);
    updatedAuction = result;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = baseMiddleware(placeBid);
