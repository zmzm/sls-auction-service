import AuctionRepository from '../repositories/auctionRepository';
import { notifyAuctionParticipants } from '../util/notification';

const auctionRepository = new AuctionRepository();

async function processAuctions() {
  const auctionsToClose = await auctionRepository.getEndedAuctions();
  auctionsToClose.forEach(async ({ id, name, seller, highestBid }) => {
    await auctionRepository.closeAuction(id);
    await notifyAuctionParticipants({ name, seller, highestBid });
  });
}

export const handler = processAuctions;
