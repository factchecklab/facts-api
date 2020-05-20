import Sequelize from 'sequelize';
import { generateId } from './util';

export default (sequelize, DataTypes) => {
  class Report extends Sequelize.Model {
    static async findAllByDocumentIds(documentIds, options) {
      const { where, ...rest } = options || {};
      const objs = await Report.findAll({
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

  Report.init(
    {
      documentId: {
        type: DataTypes.TEXT,
        field: 'document_id',
        allowNull: false,
        unqiue: true,
        defaultValue: generateId,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      source: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      url: DataTypes.TEXT,
      closed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      airtableId: {
        type: DataTypes.TEXT,
        field: 'airtable_id',
        allowNull: true,
        unqiue: true,
      },
      airtableUpdatedAt: {
        type: DataTypes.DATE,
        field: 'airtable_updated_at',
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'report',
    }
  );

  Report.associate = (models) => {
    Report.belongsTo(models.Topic, {
      as: 'topic',
      foreignKey: {
        name: 'topicId',
        field: 'topic_id',
      },
    });
    Report.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'itemId',
      constraints: false,
      scope: {
        itemType: 'report',
      },
    });
  };

  return Report;
};
