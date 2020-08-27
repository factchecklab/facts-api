// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class ReportTag extends Sequelize.Model {
    static findOrCreateByNames(names, options) {
      return Promise.all(
        names
          .map((n) => n.trim())
          .map(async (name) => {
            const attrs = {
              name,
            };
            const tags = await this.findOrCreate({
              ...options,
              where: attrs,
              defaults: attrs,
            });
            return tags[0];
          })
      );
    }
  }

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
