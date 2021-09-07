const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : 'root',
      password : 'mydatabase',
      database : 'scapro'
    }
});

module.exports = knex;
