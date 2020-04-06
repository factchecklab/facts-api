import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Report extends Sequelize.Model {}

  Report.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      source: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      url: DataTypes.TEXT,
      closed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'report',
    }
  );

  Report.associate = (models) => {
    Report.belongsTo(models.Topic, {
      as: 'topic',
      foreignKey: {
        name: 'topicId',
        field: 'topic_id',
      },
    });
    Report.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'itemId',
      constraints: false,
      scope: {
        itemType: 'report',
      },
    });
  };

  return Report;
};
