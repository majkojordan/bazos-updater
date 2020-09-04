import { MongoClient, Db } from 'mongodb';
import config from '../config/config';

const { connectionString, name: dbName, collection } = config.db;
let mongoClient: MongoClient = null;
let db: Db = null;

interface ListingEntry {
  id: string;
  images?: string[];
  folder?: string;
  data: {
    category: string;
    subCategory: string;
    title: string;
    description: string;
    price: number;
  };
}

export const init = async () => {
  mongoClient = new MongoClient(connectionString);
  await mongoClient.connect();
  db = await mongoClient.db(dbName);
};

export const close = () => mongoClient.close();

export const getAllListings = (): Promise<ListingEntry[]> => db.collection(collection).find().toArray();
