import { AUCTION_STATUS } from '../constants';

async function createAuction(event) {
  const { name } = JSON.parse(event.body);
  const now = new Date();

  const auction = {
    name,
    status: AUCTION_STATUS.open,
    createdAt: now.toISOString(),
  };

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;
