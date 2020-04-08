import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Asset extends Sequelize.Model {}

  Asset.init(
    {
      contentType: {
        field: 'content_type',
        type: DataTypes.TEXT,
        allowNull: false,
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      filename: {
        type: DataTypes.TEXT,
        allowNull: false,
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
