const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { client } = require('../../connections/database');
const logger = require('../../connections/logger');
const { TABLE_NAMES, C } = require('../../utils/constants');


client.query(`
  CREATE TABLE IF NOT EXISTS ${TABLE_NAMES.CUSTOMER} (
    ${C.ID} SERIAL,
    ${C.FULL_NAME} varchar(255) NOT NULL,
    ${C.EMAIL} varchar(255) NOT NULL UNIQUE,
    ${C.PASSWORD} varchar(255) NOT NULL,
    ${C.AGE} int,
    PRIMARY KEY (${C.ID})
  );
`).catch(err => logger.error(err));

module.exports.create = async (req, res) => {
  bcrypt.genSalt(Number(process.env.PASSWORD_HASH_ROUND), (err, salt) => {
    bcrypt.hash(req[C.BODY][C.PASSWORD], salt, async (err, hash) => {
      await client.query(`
        INSERT INTO ${TABLE_NAMES.CUSTOMER} (${C.FULL_NAME}, ${C.AGE}, ${C.EMAIL}, ${C.PASSWORD})
        VALUES ('${req[C.BODY][C.FULL_NAME]}', ${req[C.BODY][C.AGE]}, '${req[C.BODY][C.EMAIL]}', '${hash}');
      `).catch(err => {
        logger.error(err);
        res.status(400).json({ [C.MESSAGE]: 'Bad Request' });
      });
      res.status(200).json({ [C.MESSAGE]: 'Customer Created'});
    });
  });
};


module.exports.login = async (req, res) => {
  const customer = req[C.USER];
  logger.info(req.user);
  if (customer[C.ID]) {
    logger.info(`User Login ${customer[C.EMAIL]}`);
    const token = jwt.sign({ [C.ID]: customer[C.ID] }, process.env.JWT_SECRET);
    return res.status(200).json({ [C.TOKEN]: token, [C.CUSTOMER]: customer });
  }
  res.status(400).json({ [C.MESSAGE]: 'Wrong Password' });
};

module.exports.get = async (req, res) => {
  const customer = req[C.USER];
  res.status(200).json({customer});
};
