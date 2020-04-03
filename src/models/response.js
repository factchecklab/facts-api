import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Response extends Sequelize.Model {}

  Response.init(
    {
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      conclusion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    },
    {
      sequelize,
      modelName: 'response',
    }
  );

  Response.associate = (models) => {
    Response.belongsTo(models.Topic, {
      as: 'topic',
      foreignKey: {
        name: 'topic_id',
        allowNull: false,
      },
    });
    Response.belongsTo(models.Entity, {
      as: 'entity',
      foreignKey: {
        name: 'entity_id',
        allowNull: false,
      },
    });
    Response.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'item_id',
      constraints: false,
      scope: {
        itemType: 'response',
      },
    });
  };

  return Response;
};
