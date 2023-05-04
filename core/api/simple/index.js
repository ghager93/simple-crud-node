import simpleModel from "./model";

const handleSimple = (req, res) => {
    switch (req.method) {
        case 'POST':
            return createSimple(req, res);
    }
}

const createSimple = (req, res) => {
    try {
        const chunks = []
        let body;

        req.on('data', chunk => chunks.push(chunk))
        req.on('end', () => {
            body = JSON.parse(Buffer.concat(chunks))
            console.log(body)
            const simple = new simpleModel(body);
            console.log(simple)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(simple))
        })
    }
    catch(err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json')
        res.end(err.name + ": " + err.message);
    }
}

export default handleSimple;