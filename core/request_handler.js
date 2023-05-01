import helloworld from "./api/helloworld";

const handleRequest = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    switch (url.pathname) {
        case '/api/helloworld':
            helloworld(req, res);
            break;
        default:
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Invalid endpoint');
    }
}

export default handleRequest;