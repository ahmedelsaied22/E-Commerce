import mongoose, {
  ApplyBasicCreateCasting,
  DeepPartial,
  Model,
  MongooseBaseQueryOptions,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Require_id,
  UpdateQuery,
} from 'mongoose';

export abstract class DBRepo<T> {
  constructor(private readonly model: Model<Partial<T>>) {}

  async find({
    filter = {},
    projection = {},
    options = {},
  }: {
    filter?: QueryFilter<T>;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }) {
    const docs = this.model.find(filter, projection, options);
    return docs;
  }

  async findOne({
    filter,
    projection = {},
    options = {},
  }: {
    filter: QueryFilter<T>;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }) {
    const doc = this.model.findOne(filter, projection, options);
    return doc;
  }

  async findById({
    id,
    projection = {},
    options = {},
  }: {
    id: QueryFilter<T>;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }) {
    const doc = this.model.findById(id, projection, options);
    return doc;
  }

  async findByIdAndUpdate({
    id,
    update,
    options = {},
  }: {
    id: mongoose.ObjectId;
    update: UpdateQuery<T>;
    options?: QueryOptions<T>;
  }) {
    const doc = this.model.findByIdAndUpdate(id, update, options);
    return doc;
  }

  async findByIdAndDelete({
    id,
    options = {},
  }: {
    id: mongoose.ObjectId;
    options?: QueryOptions<T>;
  }) {
    const doc = this.model.findByIdAndDelete(id, options);
    return doc;
  }

  async findOneAndUpdate({
    filter,
    update,
    options = {},
  }: {
    filter: QueryFilter<T>;
    update: UpdateQuery<T>;
    options?: QueryOptions<T>;
  }) {
    const doc = this.model.findOneAndUpdate(filter, update, options);
    return doc;
  }

  async findOneAndDelete({
    filter,
    options = {},
  }: {
    filter?: QueryFilter<T>;
    options?: QueryOptions<T>;
  }) {
    const doc = this.model.findOneAndDelete(filter, options);
    return doc;
  }

  async create({
    data,
  }: {
    data: DeepPartial<ApplyBasicCreateCasting<Require_id<T>>>;
  }) {
    const doc = await this.model.create(data);
    return doc;
  }

  async updateOne({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<T>;
    update: UpdateQuery<T>;
    options?: MongooseBaseQueryOptions<T>;
  }) {
    const doc = await this.model.updateOne(filter, update, options);
    return doc;
  }

  async deleteOne({
    filter,
    options,
  }: {
    filter: QueryFilter<T>;
    options?: MongooseBaseQueryOptions<T>;
  }) {
    const doc = await this.model.deleteOne(filter, options);
    return doc;
  }
}
