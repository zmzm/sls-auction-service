import AuctionRepository from '../repositories/auctionRepository';

const auctionRepository = new AuctionRepository();

async function processAuctions() {
  const auctionsToClose = await auctionRepository.getEndedAuctions();
  const closePromises = auctionsToClose.map(({ id }) =>
    auctionRepository.closeAuction(id)
  );
  await Promise.all(closePromises);
}

export const handler = processAuctions;
