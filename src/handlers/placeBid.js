import createError from 'http-errors';
import { AUCTION_STATUS } from '../constants';

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
  const currentAuction = await auctionRepository.findById(id);

  if (currentAuction.status !== AUCTION_STATUS.open) {
    throw createError.Forbidden('You cannot bid on closed auctions!');
  }

  if (amount <= currentAuction.highestBid.amount) {
    throw createError.Forbidden(
      `Your bid must be higher than ${currentAuction.highestBid.amount}!`
    );
  }

  const updatedAuction = await auctionRepository.update(params);

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = baseMiddleware(placeBid);
