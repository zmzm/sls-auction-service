import validator from '@middy/validator';
import { v4 as uuid } from 'uuid';

import { AUCTION_STATUS } from '../constants';
import baseMiddleware from '../middleware/baseMiddleware';
import AuctionRepository from '../repositories/auctionRepository';
import createAuctionSchema from '../schemas/createAuctionSchema';

const auctionRepository = new AuctionRepository();

async function createAuction(event) {
  const {
    body: { name },
    requestContext: {
      authorizer: { email },
    },
  } = event;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    name,
    status: AUCTION_STATUS.open,
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email,
  };

  await auctionRepository.create(auction);

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = baseMiddleware(createAuction).use(
  validator({
    inputSchema: createAuctionSchema,
    ajvOptions: {
      strict: false,
    },
  })
);
