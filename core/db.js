import { MongoClient } from 'mongodb';

let client;
export let dbName;
export let collName;

export const initClient = uri => client = new MongoClient(uri);
export const getClient = () => client;
export const initDb = (dbName_, collName_) => {
    dbName = dbName_;
    collName = collName_;
}