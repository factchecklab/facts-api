import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Asset extends Sequelize.Model {}

  Asset.init(
    {
      mimetype: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      path: {
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
      modelName: 'asset',
    }
  );

  Asset.associate = (models) => {};

  return Asset;
};
