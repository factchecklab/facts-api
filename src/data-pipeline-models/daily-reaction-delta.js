import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class DailyReactionDelta extends Sequelize.Model {}

  DailyReactionDelta.init(
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
      modelName: 'reaction_deltas_interactions_daily',
      freezeTableName: true,
      timestamps: false,
    }
  );

  return DailyReactionDelta;
};
