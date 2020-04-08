'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.renameColumn('assets', 'mimetype', 'content_type', {
        transaction: t,
      });
      await queryInterface.addColumn(
        'assets',
        'filename',
        {
          type: Sequelize.TEXT,
        },
        { transaction: t }
      );
      const rows = await queryInterface.sequelize.query(
        `SELECT id FROM assets;`,
        {
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );
      await Promise.all(
        rows.map((row) => {
          return queryInterface.sequelize.query(
            `UPDATE assets SET filename = $1 WHERE id = $2`,
            {
              transaction: t,
              bind: ['file', row.id],
            }
          );
        })
      );
      await queryInterface.changeColumn(
        'assets',
        'filename',
        {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        { transaction: t }
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('assets', 'filename', {
        transaction: t,
      });
      await queryInterface.renameColumn('assets', 'content_type', 'mimetype', {
        transaction: t,
      });
    });
  },
};
