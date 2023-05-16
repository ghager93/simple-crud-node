import request from "supertest";
import server from "../core/server";
import { initClient, getClient, initDb, dbName, collName } from "../core/db";
import config from '../config/default.json' assert { type: 'json' };
import assert from 'node:assert/strict';
import { ObjectId } from "mongodb";

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
    it('returns hello world', () => {
        request(server)
            .get('/api/helloworld')
            .expect(200, 'Hello, World!')
            .end((err, res) => {
                if(err) throw err;
            });
    });
});

describe('POST /simple', () => {
    it('returns a value', () => {
        request(server)
            .post('/api/simple')
            .send('{}')
            .end((err, res) => {
                if(err) throw err;
            })
    });

    it('returns 200 for valid payload', async () => {
        const res = await request(server)
            .post('/api/simple')
            .send({"name": "test from api.test", "number": 123})
            .expect(200)
    })

    it('saves valid payload to db', async () => {
        const res = await request(server)
            .post('/api/simple')
            .send({"name": "test", "number": 123})
            .expect(200)
      
        const client = getClient();
        await client.connect()
        const result = await client.db(dbName).collection(collName).find().toArray();

        assert.equal(result[0].name, 'test')
        assert.equal(result[0].number, 123)
    })

    it('returns 400 for invalid payload', async () => {
        const res = await request(server)
            .post('/api/simple')
            .send({'not_name': 'test', 'number': 123})
            .expect(400)
    })

    it('does not save invalid payload to db', async () => {
        const res = await request(server)
            .post('/api/simple')
            .send({'not_name': 'test', 'number': 123})
                
        const client = getClient();
        await client.connect()
        const result = await client.db(dbName).collection(collName).find().toArray();
        assert.equal(result.length, 0)
    })
});

describe('GET /simple - all', () => {
    it('returns 200', () => {
        request(server)
            .get('/api/simple')
            .expect(200)
    })

    it('returns empty list if no entries', () => {
        request(server)
            .get('/api/simple')
            .expect(200, '[]')
    })

    it('returns list with single entry', async () => {
        const client = getClient();
        await client.connect();
        await client.db(dbName).collection(collName).insertOne({"name": "test", "number": 123})
        
        const res = await request(server)
            .get('/api/simple')
            .expect(200)

        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].name, 'test')
        assert.equal(res.body[0].number, 123)
    })

    it('returns list with 3 entries', async () => {
        const client = getClient();
        await client.connect();
        await client.db(dbName).collection(collName).insertMany([
            {"name": "test0", "number": 123},
            {"name": "test1", "number": 123},
            {"name": "test2", "number": 123}
        ])

        const res = await request(server)
            .get('/api/simple')
            .expect(200)

        assert.equal(res.body.length, 3)
    })
})

describe('GET /simple - by ID', () => {
    it('returns 200 for existing ID', async () => {
        const client = getClient();
        await client.connect();
        const entry = {"name": "test", "number": 123}
        await client.db(dbName).collection(collName).insertOne(
            entry
        )

        const res = await request(server)
            .get(`/api/simple?id=${entry._id}`)
            .expect(200)
        
        assert.equal(res.body.length, 1)
    })

    it('returns 404 for non-existing ID', async () => {
        const client = getClient();
        await client.connect();

        const entry = {"name": "test", "number": 123}
        const wrongOID = new ObjectId(32)
        await client.db(dbName).collection(collName).insertOne(
            entry
        )
        await request(server)
            .get(`/api/simple?id=${new ObjectId(32)}`)
            .expect(404)
    })

    it('returns correct entry', async () => {
        const client = getClient();
        await client.connect();

        const entries = [
            {"name": "test", "number": 123},
            {"name": "test1", "number": 456}
        ]

        await client.db(dbName).collection(collName).insertMany(
            entries
        )
        
        const res = await request(server)
            .get(`/api/simple?id=${entries[1]._id}`)
            .expect(200)
      
        assert.equal(res.body[0].name, "test1")
        assert.equal(res.body[0].number, 456)
    })
 })

describe('DELETE /simple', () => {
    it('returns 200 for existing ID', async () => {
        const client = getClient();
        await client.connect();
        const entry = {"name": "test", "number": 123}
        await client.db(dbName).collection(collName).insertOne(
            entry
        )
        
        await request(server)
            .delete(`/api/simple?id=${entry._id}`)
            .expect(200)
    })
    
    it('returns 404 for non-existing ID', async () => {
        const client = getClient();
        await client.connect();

        const entry = {"name": "test", "number": 123}

        await client.db(dbName).collection(collName).insertOne(
            entry
        )

        await request(server)
            .delete(`/api/simple?id=${new ObjectId(32)}`)
            .expect(404)
    })

    it('deletes correct entry', async () => {
        const client = getClient();
        await client.connect();

        const entries = [
            {"name": "test", "number": 123},
            {"name": "test1", "number": 456}
        ]

        await client.db(dbName).collection(collName).insertMany(
            entries
        )
        
        const res = await request(server)
            .delete(`/api/simple?id=${entries[1]._id}`)
            .expect(200)
  
        const result = await client.db(dbName).collection(collName).find().toArray();
        assert.equal(result.length, 1)
        assert.equal(result[0].name, "test")
    })
 })