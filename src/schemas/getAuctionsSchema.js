import { AUCTION_STATUS } from '../constants';

const getAuctionsSchema = {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(AUCTION_STATUS),
          default: AUCTION_STATUS.open,
        },
      },
    },
  },
  required: ['queryStringParameters'],
};

export default getAuctionsSchema;
