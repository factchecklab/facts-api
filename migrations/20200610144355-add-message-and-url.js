'use strict';

/* eslint-disable camelcase */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('reports', 'original_message', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('reports', 'original_urls', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: false,
      defaultValue: [],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('reports', 'original_urls');
    await queryInterface.removeColumn('reports', 'original_messages');
  },
};
