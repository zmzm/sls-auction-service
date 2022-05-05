import validator from '@middy/validator';

import baseMiddleware from '../middleware/baseMiddleware';
import AuctionRepository from '../repositories/auctionRepository';
import getAuctionsSchema from '../schemas/getAuctionsSchema';

const auctionRepository = new AuctionRepository();

async function getAuctions(event) {
  const {
    queryStringParameters: { status },
  } = event;
  const auctions = await auctionRepository.findByStatus(status);

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = baseMiddleware(getAuctions).use(
  validator({
    inputSchema: getAuctionsSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  })
);
