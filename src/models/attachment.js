import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Attachment extends Sequelize.Model {}

  Attachment.init({
    item_type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    location: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'attachment',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Attachment.associate = models => {
    Attachment.belongsTo(models.Asset, {
      as: 'asset',
      foreignKey: {
        name: 'asset_id',
        allowNull: false
      }
    })
  };

  return Attachment;
};


