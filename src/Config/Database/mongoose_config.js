const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = process.env.MONGO_DBURL;
const database = process.env.MONGO_DATABASE;

const mongoURI = `${url}/${database}`;

const mongooseConnection = async () => {
    mongoose.connection.on('error', error => {

    })
    await mongoose.connect(mongoURI);

}

module.exports = { mongooseConnection };