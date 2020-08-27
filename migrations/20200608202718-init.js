// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

'use strict';

/* eslint-disable camelcase */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('publishers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.createTable('report_tags', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.createTable('reports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      conclusion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      explanation: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      author: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fullReportUrl: {
        type: Sequelize.TEXT,
        field: 'full_report_url',
        allowNull: true,
      },
      publisherId: {
        type: Sequelize.INTEGER,
        field: 'publisher_id',
        allowNull: false,
        references: {
          model: 'publishers',
          key: 'id',
        },
      },
      publishedAt: {
        type: Sequelize.DATE,
        field: 'published_at',
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        field: 'deleted_at',
        allowNull: true,
      },
    });

    await queryInterface.createTable('report_report_tags', {
      reportId: {
        type: Sequelize.INTEGER,
        field: 'report_id',
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'reports',
          key: 'id',
        },
      },
      reportTagId: {
        type: Sequelize.INTEGER,
        field: 'report_tag_id',
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'report_tags',
          key: 'id',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('report_report_tags');
    await queryInterface.dropTable('reports');
    await queryInterface.dropTable('report_tags');
    await queryInterface.dropTable('publisher');
  },
};
