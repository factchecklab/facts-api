'use strict';

const uuidv4 = require('uuid').v4;

export const generateId = () => {
  const buf = Buffer.alloc(16);
  const uuid = uuidv4(null, buf);
  return buf.toString('base64').replace(/[=\+\/]/g, '');
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    const addDocumentIdColumn = async (tableName, transaction) => {
      await queryInterface.addColumn(
        tableName,
        'document_id',
        {
          type: Sequelize.TEXT,
        },
        { transaction }
      );
      const rows = await queryInterface.sequelize.query(
        `SELECT id FROM ${tableName};`,
        {
          type: Sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      await Promise.all(
        rows.map((row) => {
          return queryInterface.sequelize.query(
            `UPDATE ${tableName} SET document_id = $1 WHERE id = $2`,
            {
              transaction,
              bind: [generateId(), row.id],
            }
          );
        })
      );
      await queryInterface.changeColumn(
        tableName,
        'document_id',
        {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: true,
        },
        { transaction }
      );
    };

    return queryInterface.sequelize.transaction(async (t) => {
      await addDocumentIdColumn('reports', t);
      await addDocumentIdColumn('topics', t);
    });
  },

  down: (queryInterface, Sequelize) => {
    const removeDocumentIdColumn = (tableName, transaction) => {
      return queryInterface.removeColumn(tableName, 'document_id', {
        transaction,
      });
    };

    return queryInterface.sequelize.transaction(async (t) => {
      await removeDocumentIdColumn('topics', t);
      await removeDocumentIdColumn('reports', t);
    });
  },
};
