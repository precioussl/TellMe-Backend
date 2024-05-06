const pg = require('pg').Pool

const sql = new pg({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD,
    port: 5432,
  })

  module.exports = sql