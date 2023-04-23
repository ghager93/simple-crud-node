const http = require('http');
const { MongoClient } = require('mongodb');

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main() {
    const url = "mongodb://127.0.0.1:27017"
    const client = new MongoClient(url)
    
    try {
        await client.connect();
        await listDatabases(client);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close()
    }
}

const port = process.env.PORT || 8082;
const host = '127.0.0.1'

const server = http.createServer((req, res) => {
    console.log(req)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end("Hello World!")
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})

main().catch(console.error)

