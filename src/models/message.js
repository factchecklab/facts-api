import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  /**
   * Message is a piece of news content that is referenced by a topic.
   */
  class Message extends Sequelize.Model {}

  Message.init(
    {
      content: {
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
      modelName: 'message',
    }
  );

  Message.associate = (models) => {
    Message.hasOne(models.Topic, {
      as: 'topic',
      foreignKey: 'message_id',
    });
    Message.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'item_id',
      constraints: false,
      scope: {
        itemType: 'message',
      },
    });
  };

  return Message;
};
