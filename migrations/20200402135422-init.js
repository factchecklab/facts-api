'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mimetype: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      path: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.createTable('attachments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      item_type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      location: {
        type: Sequelize.TEXT,
      },
      asset_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'assets',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.createTable('entities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      homepage: {
        type: Sequelize.TEXT,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.createTable('topics', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      published: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: Sequelize.literal('FALSE'),
      },
      conclusion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      message_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'messages',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.createTable('responses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      topic_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'topics',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      published: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: Sequelize.literal('FALSE'),
      },
      conclusion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'entities',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
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
      topic_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'topics',
          key: 'id',
        },
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      source: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      url: {
        type: Sequelize.TEXT,
      },
      closed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: Sequelize.literal('FALSE'),
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reports');
    await queryInterface.dropTable('responses');
    await queryInterface.dropTable('topics');
    await queryInterface.dropTable('messages');
    await queryInterface.dropTable('entities');
    await queryInterface.dropTable('attachments');
    await queryInterface.dropTable('assets');
  },
};
