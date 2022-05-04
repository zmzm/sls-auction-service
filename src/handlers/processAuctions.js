import AuctionRepository from '../repositories/auctionRepository';

const auctionRepository = new AuctionRepository();

async function processAuctions() {
  const auctions = await auctionRepository.getEndedAuctions();
  console.log(auctions);
}

export const handler = processAuctions;
