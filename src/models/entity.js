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
      modelName: 'entity',
    }
  );

  Entity.associate = (models) => {
    Entity.hasMany(models.Response, {
      as: 'responses',
      foreignKey: 'entity_id',
    });
  };

  return Entity;
};
