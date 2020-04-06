import Sequelize from 'sequelize';
export default (sequelize, DataTypes) => {
  class Topic extends Sequelize.Model {}

  Topic.init(
    {
      title: {
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
      modelName: 'topic',
      paranoid: true,
    }
  );

  Topic.associate = (models) => {
    Topic.hasMany(models.Response, {
      as: 'responses',
      foreignKey: 'topicId',
    });

    Topic.hasMany(models.Report, {
      as: 'reports',
      foreignKey: 'topicId',
    });

    Topic.belongsTo(models.Message, {
      as: 'message',
      foreignKey: {
        name: 'messageId',
        field: 'message_id',
        allowNull: false,
      },
    });
  };

  return Topic;
};
