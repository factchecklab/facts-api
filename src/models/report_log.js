import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class ReportLog extends Sequelize.Model {}

  ReportLog.init({}, {
    sequelize,
    modelName: 'report_log',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  ReportLog.associate = models => {
    ReportLog.belongsTo(models.Report, {
      as: 'report',
      foreignKey: {
        name: 'report_id',
        allowNull: false
      }
    })
  };

  return ReportLog;
};

