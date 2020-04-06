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
    },
    {
      sequelize,
      modelName: 'message',
    }
  );

  Message.associate = (models) => {
    Message.hasOne(models.Topic, {
      as: 'topic',
      foreignKey: 'messageId',
    });
    Message.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'itemId',
      constraints: false,
      scope: {
        itemType: 'message',
      },
    });
  };

  return Message;
};
