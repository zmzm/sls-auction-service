async function uploadAuctionPicture() {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

export const handler = uploadAuctionPicture;
