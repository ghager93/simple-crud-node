import request from "supertest";
import server from "../core/server";
import { initClient, getClient } from "../core/db";
import config from '../config/default.json' assert { type: 'json' };

beforeAll(() => {
    initClient(config.db.test_uri)
})

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error

    const client = getClient()
    await client.db('simpleCrudNode').dropDatabase();
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

    it('returns 200 for valid payload', function () {
        request(server)
            .post('/api/simple')
            .send({"name": "test", "number": 123})
            .expect(200)
            .end((err, res) => {
                if(err) throw err;
            });
    })

    it('saves valid payload to db', async function () {
        const client = getClient();
        const res = client.db('simpleCrudNode').find()
        console.log(res)
    })
});