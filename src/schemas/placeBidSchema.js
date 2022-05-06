const placeBidSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'User provided bid amount',
        },
      },
      required: ['amount'],
    },
    pathParameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'User provided auction id',
        },
      },
      required: ['id'],
    },
  },
  required: ['body', 'pathParameters'],
};

export default placeBidSchema;
