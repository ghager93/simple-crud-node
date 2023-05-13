import request from "supertest";
import server from "../core/server";
import { initClient, getClient, initDb, dbName, collName } from "../core/db";
import config from '../config/default.json' assert { type: 'json' };
import assert from 'node:assert/strict';

beforeEach(() => {
    initClient(config.db.test_uri);
    initDb('simpleCrudNode', 'testSimple');
})

afterEach(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error

    const client = getClient()
    await client.connect()
    await client.db(dbName).collection(collName).deleteMany({});
    await client.close()    
});

describe('GET /helloworld', () => {
    it('returns hello world', function () {
        request(server)
            .get('/api/helloworld')
            .expect(200, 'Hello, World!')
            .end((err, res) => {
                if(err) throw err;
            });
    });
});

describe('POST /simple', () => {
    it('returns a value', function () {
        request(server)
            .post('/api/simple')
            .send('{}')
            .end((err, res) => {
                if(err) throw err;
            })
    });

    it('returns 200 for valid payload', async function () {
        request(server)
            .post('/api/simple')
            .send({"name": "test from api.test", "number": 123})
            .expect(200)
            .end(async (err, res) => {
                if(err) throw err;
            });

    })

    it('saves valid payload to db', async function () {
        request(server)
            .post('/api/simple')
            .send({"name": "test", "number": 123})
            .expect(200)
            .end(async (err, res) => {
                if(err) throw err;

                const client = getClient();
                await client.connect()
                const result = await client.db(dbName).collection(collName).find().toArray();
                assert.equal(result[0].name, 'test')
                assert.equal(result[0].number, 123)
            });
    })

    it('returns 400 for invalid payload', async () => {
        request(server)
            .post('/api/simple')
            .send({'not_name': 'test', 'number': 123})
            .expect(400)
            .end((err, res) => {
                if(err) throw err;
            })
    })

    it('does not save invalid payload to db', async () => {
        request(server)
            .post('/api/simple')
            .send({'not_name': 'test', 'number': 123})
            .end(async (err, res) => {
                if(err) throw err;
                
                const client = getClient();
                await client.connect()
                const result = await client.db(dbName).collection(collName).find().toArray();
                assert.equal(result.length, 0)
            })        
    })
});

describe('GET /simple - all', () => {
    it('returns 200', () => {
        request(server)
            .get('/api/simple')
            .expect(200)
            .end((err, res) => {
                if(err) throw err;
            });
    })

    it('returns empty list if no entries', () => {
        request(server)
            .get('/api/simple')
            .expect(200, '[]')
            .end((err, res) => {
                if(err) throw err;
            })
    })
})