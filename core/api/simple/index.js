import simpleModel from "./model";
import { getClient } from "../../db";


const handleSimple = (req, res) => {
    switch (req.method) {
        case 'POST':
            return createSimple(req, res);
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
            await client.db('simpleCrudNode').collection('simple').insertOne(simple)
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

export default handleSimple;