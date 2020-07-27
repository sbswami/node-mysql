const { client } = require('../../connections/database');
const logger = require('../../connections/logger');
const { TABLE_NAMES, C, CONST } = require('../../utils/constants');
const { products } = require('./payload');


client.query(`
  CREATE TABLE IF NOT EXISTS ${TABLE_NAMES.PRODUCT} (
    ${C.ID} SERIAL,
    ${C.SKU} varchar(255) NOT NULL UNIQUE,
    ${C.NAME} varchar(255) NOT NULL,
    ${C.CODE} varchar(255) NOT NULL UNIQUE,
    ${C.QUANTITY} int NOT NULL,
    ${C.PRICE} float NOT NULL,
    PRIMARY KEY (${C.ID})
  );
`).catch(err => logger.error(err));

module.exports.loadProducts = async (req, res) => {
  let query = `
    INSERT INTO ${TABLE_NAMES.PRODUCT}
    (${C.SKU}, ${C.NAME}, ${C.PRICE}, ${C.QUANTITY}, ${C.CODE})
    VALUES 
  `;
  query += products.map(
    product => `
      (
        '${product[C.SKU]}',
        '${product[C.NAME]}',
        ${product[C.PRICE]},
        ${product[C.QUANTITY]},
        '${product[C.CODE]}'
      )
    `
  ).join(', ');
  const response = await client.query(query).catch(err => {
    logger.error(err);
    res.status(400).json({ [C.MESSAGE]: 'Bad Request' });
  });
  res.status(200).json({ response });
};

module.exports.list = async (req, res) => {
  const response = await client.query(`
    SELECT * FROM ${TABLE_NAMES.PRODUCT}
    OFFSET ${req[C.QUERY][C.OFFSET] || CONST.OFFSET}
    LIMIT ${req[C.QUERY][C.LIMIT] || CONST.LIMIT}
  `).catch(err => {
    logger.error(err);
    res.status(400).json({ [C.MESSAGE]: 'Bad Request' });
  });
  res.status(200).json({ [C.PRODUCT]: response.rows });
};

module.exports.get = async (req, res) => {
  const products = await client.query(
    `SELECT * FROM ${TABLE_NAMES.PRODUCT} WHERE ${C.SKU}='${req[C.QUERY][C.SKU]}'`
  ).catch(err => {
    logger.error(err);
    res.status(400).json({ [C.MESSAGE]: 'Bad Request' });
  });
  res.status(200).json({ [C.PRODUCT]: products.rows });
};

module.exports.update = async (req, res) => {
  logger.info(req[C.BODY]);
  await client.query(
    `UPDATE ${TABLE_NAMES.PRODUCT}
    SET
    ${req[C.BODY][C.QUANTITY] ? `${C.QUANTITY} = ${req[C.BODY][C.QUANTITY]}` : ''}
    WHERE ${C.SKU}='${req[C.BODY][C.SKU]}';`
  ).catch(err => {
    logger.error(err);
    res.status(400).json({ [C.MESSAGE]: 'Bad Request' });
  });
  res.status(200).json({ [C.MESSAGE]: 'Updated' });
};
