'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'topics',
        'deleted_at',
        {
          type: Sequelize.DATE,
        },
        { transaction: t }
      );
      await queryInterface.addColumn(
        'responses',
        'deleted_at',
        {
          type: Sequelize.DATE,
        },
        { transaction: t }
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('responses', 'deleted_at', {
        transaction: t,
      });
      await queryInterface.removeColumn('topics', 'deleted_at', {
        transaction: t,
      });
    });
  },
};
