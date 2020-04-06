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
    },
    {
      sequelize,
      modelName: 'asset',
    }
  );

  Asset.associate = (models) => {};

  return Asset;
};
