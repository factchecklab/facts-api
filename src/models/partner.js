import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Partner extends Sequelize.Model {}

  Partner.init({
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    homepage: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'partner',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Partner.associate = models => {
    Partner.hasMany(models.Response, {
      as: 'responses',
      foreignKey: 'partner_id'
    })
  };

  return Partner;
};

