import validator from '@middy/validator';
import createError from 'http-errors';

import { AUCTION_STATUS } from '../constants';
import baseMiddleware from '../middleware/baseMiddleware';
import AuctionRepository from '../repositories/auctionRepository';
import placeBidSchema from '../schemas/placeBidSchema';

const auctionRepository = new AuctionRepository();

async function placeBid(event) {
  const {
    pathParameters: { id },
  } = event;
  const {
    body: { amount },
    requestContext: {
      authorizer: { email },
    },
  } = event;
  const params = {
    Key: { id },
    UpdateExpression:
      'set highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributeValues: {
      ':amount': amount,
      ':bidder': email,
    },
    ReturnValues: 'ALL_NEW',
  };
  const currentAuction = await auctionRepository.findById(id);

  if (currentAuction.status !== AUCTION_STATUS.open) {
    throw createError.Forbidden('You cannot bid on closed auctions!');
  }

  if (currentAuction.seller === email) {
    throw createError.Forbidden('You cannot bid on your own auction!');
  }

  if (currentAuction.highestBid.bidder === email) {
    throw createError.Forbidden('You already placed a highest bid!');
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

export const handler = baseMiddleware(placeBid).use(
  validator({
    inputSchema: placeBidSchema,
    ajvOptions: {
      strict: false,
    },
  })
);
