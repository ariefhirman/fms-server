const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

module.exports = {
  // use this if you aren't using Docker container
  HOST: "localhost",
  PORT: 27017,
  DB: "psg-warehouse"
  // HOST: DB_HOST,
  // PORT: DB_PORT,
  // DB: DB_NAME
};