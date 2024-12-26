const { Pool } = require('pg');

const connection = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRESQL_PORT,
  max: 20
})

const dev_connection = new Pool({
  host: process.env.POSTGRESQL_HOST_DEV,
  database: process.env.POSTGRES_DATABASE_DEV,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRESQL_PORT
})


module.exports = { connection, dev_connection };