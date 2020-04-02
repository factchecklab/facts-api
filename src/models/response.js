import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Response extends Sequelize.Model {}

  Response.init({
    title: DataTypes.TEXT,
    content: DataTypes.TEXT,
    published: DataTypes.BOOLEAN,
    conclusion: DataTypes.TEXT,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'response',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Response.associate = models => {
    Response.belongsTo(models.Topic, {
      as: 'topic',
      foreignKey: {
        name: 'topic_id',
        allowNull: false
      }
    })
    Response.belongsTo(models.Partner, {
      as: 'partner',
      foreignKey: {
        name: 'partner_id',
        allowNull: false
      }
    })
    Response.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'item_id',
      constraints: false,
      scope: {
        item_type: 'response'
      }
    })
  };

  return Response;
};

