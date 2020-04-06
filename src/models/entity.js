import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Entity extends Sequelize.Model {}

  Entity.init(
    {
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      homepage: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'entity',
    }
  );

  Entity.associate = (models) => {
    Entity.hasMany(models.Response, {
      as: 'responses',
      foreignKey: 'entityId',
    });
  };

  return Entity;
};
