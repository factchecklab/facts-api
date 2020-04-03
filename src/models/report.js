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
      modelName: 'report',
    }
  );

  Report.associate = (models) => {
    Report.belongsTo(models.Topic, {
      as: 'topic',
      foreignKey: {
        name: 'topic_id',
      },
    });
    Report.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'item_id',
      constraints: false,
      scope: {
        itemType: 'report',
      },
    });
  };

  return Report;
};
