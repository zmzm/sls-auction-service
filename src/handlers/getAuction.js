import createError from 'http-errors';

import baseMiddleware from '../middleware/baseMiddleware';
import AuctionRepository from '../repositories/auctionRepository';

const auctionRepository = new AuctionRepository();

async function getAuction(event) {
  const {
    pathParameters: { id },
  } = event;
  let auction = null;

  try {
    const result = await auctionRepository.findById(id);
    auction = result;
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
