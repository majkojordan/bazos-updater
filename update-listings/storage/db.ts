import { MongoClient, Db } from 'mongodb';
// var assert = require('assert');
// var ObjectId = require('mongodb').ObjectID;
// var url = 'mongodb://<username>:<password>@<endpoint>.documents.azure.com:10255/?ssl=true';

import config from '../config/config';

const { connectionString, id: dbId } = config.db;
let db: Db = null;

export const init = async () => {
  const mongoClient = new MongoClient(connectionString);
  await mongoClient.connect();
  db = await mongoClient.db(dbId);
};

export const getAllItems = (containerId: string) => db.collection(containerId).find().toArray();
