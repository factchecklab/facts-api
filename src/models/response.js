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
    },
    {
      sequelize,
      modelName: 'response',
      paranoid: true,
    }
  );

  Response.associate = (models) => {
    Response.belongsTo(models.Topic, {
      as: 'topic',
      foreignKey: {
        name: 'topicId',
        field: 'topic_id',
        allowNull: false,
      },
    });
    Response.belongsTo(models.Entity, {
      as: 'entity',
      foreignKey: {
        name: 'entityId',
        field: 'entity_id',
        allowNull: false,
      },
    });
    Response.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'itemId',
      constraints: false,
      scope: {
        itemType: 'response',
      },
    });
  };

  return Response;
};
