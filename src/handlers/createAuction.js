import { v4 as uuid } from 'uuid';
import createError from 'http-errors';

import { AUCTION_STATUS } from '../constants';
import baseMiddleware from '../middleware/baseMiddleware';
import AuctionRepository from '../repositories/auctionRepository';

const auctionRepository = new AuctionRepository();

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
    highestBid: {
      amount: 0,
    },
  };

  try {
    await auctionRepository.create(auction);
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = baseMiddleware(createAuction);
