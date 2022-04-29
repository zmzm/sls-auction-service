import createError from 'http-errors';

import baseMiddleware from '../middleware/baseMiddleware';
import AuctionRepository from '../repositories/auctionRepository';

const auctionRepository = new AuctionRepository();

async function getAuctions() {
  try {
    const auctions = await auctionRepository.findAll();

    return {
      statusCode: 200,
      body: JSON.stringify(auctions),
    };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export const handler = baseMiddleware(getAuctions);
