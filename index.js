import server from './server.js';
import { initClient, getClient } from './db.js';
import config from './config/default.json' assert { type: 'json' };

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main() {
    initClient(config.db.uri);
    const client = getClient();
    try {
        await client.connect();
        await listDatabases(client);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

server.listen(config.server.port, config.server.host, () => {
    console.log(`Server running at ${config.server.host}:${config.server.port}/`);
});

main().catch(console.error)

