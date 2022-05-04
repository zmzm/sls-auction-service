import AWS from 'aws-sdk';
import createError from 'http-errors';
import { AUCTION_STATUS } from '../constants';

export default class AuctionRepository {
  db = new AWS.DynamoDB.DocumentClient();

  table = process.env.AUCTION_TABLE_NAME;

  async findAll() {
    try {
      const { Items } = await this.db.scan({ TableName: this.table }).promise();

      return Items;
    } catch (error) {
      throw new createError.InternalServerError(error);
    }
  }

  async findById(id) {
    let auction = null;
    try {
      const { Item } = await this.db
        .get({ TableName: this.table, Key: { id } })
        .promise();

      auction = Item;
    } catch (error) {
      throw new createError.InternalServerError(error);
    }

    if (!auction) {
      throw new createError.NotFound(`Auction with ID ${id} not found.`);
    }

    return auction;
  }

  async create(entity) {
    try {
      const { Item } = await this.db
        .put({ TableName: this.table, Item: entity })
        .promise();

      return Item;
    } catch (error) {
      throw new createError.InternalServerError(error);
    }
  }

  async update(params) {
    try {
      const { Attributes } = await this.db
        .update({ TableName: this.table, ...params })
        .promise();

      return Attributes;
    } catch (error) {
      throw new createError.InternalServerError(error);
    }
  }

  async getEndedAuctions() {
    try {
      const now = new Date();
      const params = {
        TableName: this.table,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status AND endingAt <= :now',
        ExpressionAttributeValues: {
          ':now': now.toISOString(),
          ':status': AUCTION_STATUS.open,
        },
        ExpressionAttributeNames: {
          '#status': 'status',
        },
      };

      const { Items } = await this.db.query(params).promise();

      return Items;
    } catch (error) {
      throw new createError.InternalServerError(error);
    }
  }
}
