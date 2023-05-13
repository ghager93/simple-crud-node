import helloworld from "./api/helloworld";
import handleSimple from "./api/simple";

const handleRequest = (req, res) => {
    const url = new URL(req.url )
    switch (url.pathname) {
        case '/api/helloworld':
            helloworld(req, res);
            break;
        case '/api/simple':
            handleSimple(req, res);
            break;
        default:
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Invalid endpoint');
    }
}

export default handleRequest;