import { MongoClient } from 'mongodb';

let client;

export const initClient = uri => client = new MongoClient(uri);
export const getClient = () => client;
