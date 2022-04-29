import baseMiddleware from '../middleware/baseMiddleware';
import AuctionRepository from '../repositories/auctionRepository';

const auctionRepository = new AuctionRepository();

async function getAuctions() {
  const auctions = await auctionRepository.findAll();

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = baseMiddleware(getAuctions);
