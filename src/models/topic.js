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
      modelName: 'topic',
    }
  );

  Topic.associate = (models) => {
    Topic.hasMany(models.Response, {
      as: 'responses',
      foreignKey: 'topic_id',
    });
    Topic.hasMany(models.Report, {
      as: 'reports',
      foreignKey: 'topic_id',
    });
    Topic.belongsTo(models.Message, {
      as: 'message',
      foreignKey: {
        name: 'message_id',
        allowNull: false,
      },
    });
  };

  return Topic;
};
