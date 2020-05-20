'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'reports',
        'airtable_id',
        {
          type: Sequelize.TEXT,
          allowNull: true,
          unique: true,
        },
        { t }
      );
      await queryInterface.addColumn(
        'reports',
        'airtable_updated_at',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { t }
      );
      await queryInterface.addColumn(
        'attachments',
        'airtable_id',
        {
          type: Sequelize.TEXT,
          allowNull: true,
          unique: true,
        },
        { t }
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('attachments', 'airtable_id', {
        t,
      });
      await queryInterface.removeColumn('reports', 'airtable_updated_at', {
        t,
      });
      await queryInterface.removeColumn('reports', 'airtable_id', {
        t,
      });
    });
  },
};
