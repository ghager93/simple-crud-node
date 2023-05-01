import request from "supertest";
import server from "../core/server";
import assert, { doesNotMatch } from "assert";
import config from "../config/default.json";

afterEach(() => {
    // server.close()
});

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
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
            .end((err, res) => {
                console.log(res.statusCode)
                if(err) throw err;
            })
    });

    it('returns 200 for valid payload', function () {
        request(server)
            .post('/api/simple')
            .expect(200)
            .end((err, res) => {
                if(err) throw err;
            });
    })
});