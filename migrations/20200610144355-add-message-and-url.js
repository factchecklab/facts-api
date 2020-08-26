// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
