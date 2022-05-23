import createError from 'http-errors';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';

import AuctionRepository from '../repositories/auctionRepository';
import { uploadPictureToS3 } from '../util/auploadPictureToS3';
import uploadAuctionPictureSchema from '../schemas/uploadAuctionPictureSchema';

const auctionRepository = new AuctionRepository();

async function uploadAuctionPicture(event) {
  const {
    body,
    pathParameters: { id },
    requestContext: {
      authorizer: { email },
    },
  } = event;

  const auction = await auctionRepository.findById(id);

  if (auction.seller !== email) {
    throw createError.Forbidden('You are not the auction owner!');
  }

  const base64 = body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  const imageName = `${auction.id}.jpg`;

  try {
    const { Location } = await uploadPictureToS3(imageName, buffer);
    const updatedAuction = await auctionRepository.setAuctionPicture({
      pictureUrl: Location,
      auctionId: auction.id,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(updatedAuction),
    };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler())
  .use(validator({ inputSchema: uploadAuctionPictureSchema }));
