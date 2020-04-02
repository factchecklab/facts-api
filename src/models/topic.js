import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Topic extends Sequelize.Model {}

  Topic.init({
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    summary: DataTypes.TEXT,
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    conclusion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'topic',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Topic.associate = models => {
    Topic.belongsTo(models.Report, {
      as: 'originalReport',
      foreignKey: {
        name: 'original_report_id',
        allowNull: false
      }
    })
    Topic.hasMany(models.Response, {
      as: 'responses',
      foreignKey: 'topic_id'
    })
    Topic.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'item_id',
      constraints: false,
      scope: {
        item_type: 'topic'
      }
    })
  };

  return Topic;
};
