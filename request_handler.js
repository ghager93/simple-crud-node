const handleRequest = (req, res) => {
    switch (req.url) {
        case '/helloworld':
            console.log('hello')
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Hello, World!');
            break;
        default:
            console.log('default')
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Invalid endpoint');
    }
}

export default handleRequest;