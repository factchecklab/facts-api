'use strict';

const uuidv4 = require('uuid').v4;

export const generateId = () => {
  const buf = Buffer.alloc(16);
  const uuid = uuidv4(null, buf);
  return buf.toString('base64').replace(/[=\+\/]/g, '');
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'reports',
        'document_id',
        {
          type: Sequelize.TEXT,
        },
        { transaction: t }
      );
      const rows = await queryInterface.sequelize.query(
        'SELECT id FROM reports;',
        {
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );
      await Promise.all(
        rows.map((row) => {
          return queryInterface.sequelize.query(
            'UPDATE reports SET document_id = $1 WHERE id = $2',
            {
              transaction: t,
              bind: [generateId(), row.id],
            }
          );
        })
      );
      await queryInterface.changeColumn(
        'reports',
        'document_id',
        {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: true,
        },
        { transaction: t }
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('reports', 'document_id', {
        transaction: t,
      });
    });
  },
};
