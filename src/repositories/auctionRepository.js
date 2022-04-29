import AWS from 'aws-sdk';
import createError from 'http-errors';

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
    try {
      const { Item } = await this.db
        .get({ TableName: this.table, Key: { id } })
        .promise();

      return Item;
    } catch (error) {
      throw new createError.InternalServerError(error);
    }
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
}
