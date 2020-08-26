// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Publisher extends Sequelize.Model {}

  Publisher.init(
    {
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'publisher',
    }
  );

  Publisher.associate = (models) => {
    Publisher.hasMany(models.Report, {
      as: 'reports',
      foreignKey: 'publisherId',
    });
  };

  return Publisher;
};
