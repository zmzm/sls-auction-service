const createAuctionSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'User provided auction title',
        },
      },
      required: ['title'],
    },
  },
  required: ['body'],
};

export default createAuctionSchema;
