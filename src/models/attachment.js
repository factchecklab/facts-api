import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  /**
   * Attachment is additional data that can be attached to an item.
   */
  class Attachment extends Sequelize.Model {}

  Attachment.init(
    {
      itemType: {
        field: 'item_type',
        type: DataTypes.TEXT,
        allowNull: false,
      },
      itemId: {
        field: 'item_id',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      location: DataTypes.TEXT,
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
      modelName: 'attachment',
    }
  );

  Attachment.associate = (models) => {
    Attachment.belongsTo(models.Asset, {
      as: 'asset',
      foreignKey: 'asset_id',
    });
  };

  return Attachment;
};
