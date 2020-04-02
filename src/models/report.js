import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Report extends Sequelize.Model {}

  Report.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    source: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    url: DataTypes.TEXT,
    closed: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'report',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Report.associate = models => {
    Report.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'item_id',
      constraints: false,
      scope: {
        item_type: 'report'
      }
    })
  };

  return Report;
};
