var pg = require('pg')
const pool = new pg.Pool({
    user: 'postgres',
    password: 'cse110',
    host: 'pageus.site',
    port: 5432,
    database: 'mydb',
  })
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, (err, res) => {
      callback(err, res)
    })
  },
}
module.exports.pool = pool;