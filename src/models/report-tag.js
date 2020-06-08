import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class ReportTag extends Sequelize.Model {}

  ReportTag.init(
    {
      name: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'report_tag',
    }
  );

  ReportTag.associate = (models) => {
    ReportTag.belongsToMany(models.Report, {
      as: 'reports',
      through: 'report_report_tags',
      foreignKey: {
        name: 'reportTagId',
        field: 'report_tag_id',
      },
      otherKey: {
        name: 'reportId',
        field: 'report_id',
      },
      timestamps: false,
    });
  };

  return ReportTag;
};
