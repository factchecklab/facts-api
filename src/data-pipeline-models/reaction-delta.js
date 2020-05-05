import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class ReactionDelta extends Sequelize.Model {}

  ReactionDelta.init(
    {
      platform: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
      },
      identifier: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
      },
      reactionType: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'reaction_type',
        primaryKey: true,
      },
      labelTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'label_time',
        primaryKey: true,
      },
      deltaValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'delta_value',
      },
    },
    {
      sequelize,
      modelName: 'reaction_deltas',
      timestamps: false,
    }
  );

  return ReactionDelta;
};
