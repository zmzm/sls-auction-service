import baseMiddleware from '../middleware/baseMiddleware';
import AuctionRepository from '../repositories/auctionRepository';

const auctionRepository = new AuctionRepository();

async function getAuction(event) {
  const {
    pathParameters: { id },
  } = event;

  const auction = await auctionRepository.findById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = baseMiddleware(getAuction);
