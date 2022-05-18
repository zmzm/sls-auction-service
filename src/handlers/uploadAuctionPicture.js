import createError from 'http-errors';
import AuctionRepository from '../repositories/auctionRepository';
import { uploadPictureToS3 } from '../util/auploadPictureToS3';

const auctionRepository = new AuctionRepository();

async function uploadAuctionPicture(event) {
  const {
    body,
    pathParameters: { id },
  } = event;

  const auction = await auctionRepository.findById(id);

  const base64 = body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  const imageName = `${auction.id}.jpg`;

  try {
    const uploadResult = await uploadPictureToS3(imageName, buffer);

    return {
      statusCode: 200,
      body: JSON.stringify(uploadResult),
    };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export const handler = uploadAuctionPicture;
