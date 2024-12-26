
const { MongoClient, GridFSBucket } = require('mongodb');
const url = process.env.MONGO_DBURL;
const client = new MongoClient(url);

const database = process.env.MONGO_DATABASE;
const filestore = process.env.FILESTORE;

async function getMongoConnection() {
    let mongoConn = await client.connect();
    
   // return mongoConn.db('LocalDatabase');
    return mongoConn.db(database);
}

async function closeMongoConnection() {
    return client.close();
}
module.exports = { getMongoConnection, closeMongoConnection };
