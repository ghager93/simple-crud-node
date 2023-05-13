import server from './server.js';
import { Server } from 'http';
import { MongoClient } from 'mongodb';
import { initClient, getClient, initDb } from './db.js';
import config from '../config/default.json' assert {type: 'json'};

beforeEach(() => {
    initClient(config.db.test_uri);
    initDb('simpleCrudNode', 'testSimple');
});

test('checks server object', () => {
    expect(server).toBeInstanceOf(Server);
});

test('checks db client object', () => {
    const client = getClient();
    expect(client).toBeInstanceOf(MongoClient);
})