import server from './server.js';
import { Server } from 'http';
import { MongoClient } from 'mongodb';
import { initClient, getClient } from './db.js';
import config from './config/default.json' assert {type: 'json'};

beforeEach(() => {
    initClient(config.db.test_uri);
    const client = getClient();
});

test('checks server object', () => {
    expect(server).toBeInstanceOf(Server);
});

test('checks db client object', () => {
    expect(client).toBeInstanceOf(MongoClient);
})