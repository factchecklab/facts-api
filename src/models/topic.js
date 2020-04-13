import Sequelize from 'sequelize';
import { generateId } from './util';

export default (sequelize, DataTypes) => {
  class Topic extends Sequelize.Model {
    static async findAllByDocumentIds(documentIds, options) {
      const { where, ...rest } = options || {};
      const objs = await Topic.findAll({
        where: { ...where, documentId: documentIds },
        ...rest,
      });

      // Return objects in the order the ID is specified, skipping any
      // objects not found.
      return documentIds
        .map((id) => {
          return objs.find((r) => r.documentId === id);
        })
        .filter((r) => !!r);
    }
  }

  Topic.init(
    {
      documentId: {
        type: DataTypes.TEXT,
        field: 'document_id',
        allowNull: false,
        unqiue: true,
        defaultValue: generateId,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      conclusion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'topic',
      paranoid: true,
      defaultScope: {
        where: {
          published: true,
        },
      },
    }
  );

  Topic.associate = (models) => {
    Topic.hasMany(models.Response, {
      as: 'responses',
      foreignKey: 'topicId',
    });

    Topic.hasMany(models.Report, {
      as: 'reports',
      foreignKey: 'topicId',
    });

    Topic.belongsTo(models.Message, {
      as: 'message',
      foreignKey: {
        name: 'messageId',
        field: 'message_id',
        allowNull: false,
      },
    });

    Topic.belongsTo(models.Asset, {
      as: 'coverImage',
      foreignKey: {
        name: 'coverImageAssetId',
        field: 'cover_image_asset_id',
      },
    });
  };

  return Topic;
};
