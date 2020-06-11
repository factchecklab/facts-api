import Sequelize from 'sequelize';
import { cleanUrl } from '../util/url';

export default (sequelize, DataTypes) => {
  class Report extends Sequelize.Model {
    static async findAllByPk(ids, options) {
      const { where, ...rest } = options || {};
      const objs = await Report.findAll({
        where: { ...where, id: ids },
        ...rest,
      });

      // Return objects in the order the ID is specified, skipping any
      // objects not found.
      return ids
        .map((id) => {
          return objs.find((r) => r.id === id);
        })
        .filter((r) => !!r);
    }
  }

  Report.init(
    {
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      conclusion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      author: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fullReportUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value) {
          this.setDataValue('fullReportUrl', value ? cleanUrl(value) : null);
        },
      },
      publishedAt: {
        type: DataTypes.DATE,
        field: 'published_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      originalMessage: {
        type: DataTypes.TEXT,
        field: 'original_message',
        allowNull: false,
        defaultValue: '',
      },
      originalUrls: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        field: 'original_urls',
        allowNull: false,
        defaultValue: [],
        set(value) {
          this.setDataValue('originalUrls', (value || []).map(cleanUrl));
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'report',
    }
  );

  Report.associate = (models) => {
    Report.belongsTo(models.Publisher, {
      as: 'publisher',
      allowNull: false,
      foreignKey: {
        name: 'publisherId',
        field: 'publisher_id',
      },
    });
    Report.belongsToMany(models.ReportTag, {
      as: 'reportTags',
      through: 'report_report_tags',
      foreignKey: {
        name: 'reportId',
        field: 'report_id',
      },
      otherKey: {
        name: 'reportTagId',
        field: 'report_tag_id',
      },
      timestamps: false,
    });
  };

  return Report;
};
