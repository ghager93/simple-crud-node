import request from "supertest";
import server from "../server";
import assert from "assert";
import config from "../config/default.json"


describe('Hello world', () => {
    server.listen(5555)
    
    it('returns hello world', function() {
        request(server)
            .get('/api/helloworld')
            .expect(200)
            .then(res => {
                assert(res.body, 'Hello, World!');
            });
    });

    server.close()
});