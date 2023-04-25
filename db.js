const { MongoClient } = require('mongodb');
const config = require('./config/default.json');

const client = new MongoClient(config.db.uri);

module.exports = client;