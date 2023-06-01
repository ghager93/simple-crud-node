import { ObjectId } from "mongodb";

import simpleModel from "./model";
import { getClient, dbName, collName } from "../../db";


const handleSimple = (req, res) => {
    switch (req.method) {
        case 'POST':
            return createSimple(req, res);
        case 'GET':
            return getSimple(req, res);
        case 'DELETE':
            return deleteSimple(req, res);
        case 'PATCH':
            return patchSimple(req, res);
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
            if(err instanceof SyntaxError || err instanceof TypeError) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(`{"Error": "${err.name}: ${err.message}"}`)
            } else {
                console.log(err.name)
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json')
                res.end(`{"Error": "${err.name}: ${err.message}"}`);
            }
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
    const cursorArray = await cursor.toArray()
    if(cursorArray.length === 0) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json');
        res.end('{"Error": "ID does not exist"}');
    }
    else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(cursorArray));
    }
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

const deleteSimple = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const id = url.searchParams.get('id')

    const client = getClient();
    await client.connect();
    const cursor = await client.db(dbName).collection(collName).findOneAndDelete(
        {"_id": new ObjectId(id)}
    );

    const result = cursor.value;
    if(result === null) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({"Error": "ID does not exist."}))
    }
    else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result))
    }
}

const patchSimple = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const id = url.searchParams.get('id')
    const chunks = []
    
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', async () => {
        const client = getClient();
        await client.connect();
        const bodyString = chunks.length > 0 ? Buffer.concat(chunks): '{}';
        const body = JSON.parse(bodyString);
        if(Object.keys(body).length === 0) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end('{"result": "nothing to patch"}')
        }
        else {
            const updateRes = await client.db(dbName).collection(collName).updateOne(
                { "_id": new ObjectId(id)},
                { $set: body }
            )
            if(updateRes.matchedCount === 0) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({"Error": "ID does not exist."}))
            }
            else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end('{"result": "entry patched"}')
            }
        }
    })
}

export default handleSimple;