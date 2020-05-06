import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class HourlyReactionDelta extends Sequelize.Model {}

  HourlyReactionDelta.init(
    {
      identifier: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'time',
        primaryKey: true,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'value',
      },
    },
    {
      sequelize,
      modelName: 'reaction_deltas_interactions_hourly',
      freezeTableName: true,
      timestamps: false,
    }
  );

  return HourlyReactionDelta;
};
