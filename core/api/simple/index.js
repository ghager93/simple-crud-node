import { ObjectId } from "mongodb";

import simpleModel from "./model";
import { getClient, dbName, collName } from "../../db";


const handleSimple = (req, res) => {
    switch (req.method) {
        case 'POST':
            return createSimple(req, res);
        case 'GET':
            return getSimple(req, res);
    }
}

const createSimple = (req, res) => {
    const chunks = []
    
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', async () => {
        const client = getClient();
        const bodyString = chunks.length > 0 ? Buffer.concat(chunks): '{}';
        const body = JSON.parse(bodyString);
        
        try {
            const simple = new simpleModel(body);

            await client.connect();
            await client.db(dbName).collection(collName).insertOne(simple)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(simple))
        }
        catch(err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json')
            res.end(`{"Error": "${err.name}: ${err.message}"}`);
        }
        finally {
            await client.close()
        }
    })
}

const getSimpleAll = async (req, res) => {
    const client = getClient();
    await client.connect();
    const cursor = await client.db(dbName).collection(collName).find();
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(await cursor.toArray()));
}

const getSimpleById = async (req, res) => {
    const client = getClient();
    await client.connect();
    const cursor = await client.db(dbName).collection(collName).find(
        new ObjectId(req.id)
    );

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(await cursor.toArray()));
}

const getSimple = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const id = url.searchParams.get('id')
    if(id) {
        req.id = id;
        getSimpleById(req, res);
    } 
    else {
        getSimpleAll(req, res);
    }

}

export default handleSimple;