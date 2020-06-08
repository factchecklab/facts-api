import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Report extends Sequelize.Model {}

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
      },
      publishedAt: {
        type: DataTypes.DATE,
        field: 'published_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
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
