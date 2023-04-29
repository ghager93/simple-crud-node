import { createServer } from 'http';
import handleRequest from './request_handler';

const server = createServer(handleRequest);

export default server;