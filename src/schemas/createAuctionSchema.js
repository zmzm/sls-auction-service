const createAuctionSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'User provided auction name',
        },
      },
      required: ['name'],
    },
  },
  required: ['body'],
};

export default createAuctionSchema;
