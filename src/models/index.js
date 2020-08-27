// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import { parse } from '../util/database-connection-string';
import { logger } from '../logging';

dotenv.config();

const sequelizeOptions = {
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
  },
  logging: (...args) => {
    logger.info(...args);
  },
};

const sequelize = (() => {
  if (process.env.DATABASE_URL) {
    return new Sequelize({
      ...parse(process.env.DATABASE_URL),
      ...sequelizeOptions,
    });
  } else {
    // Specify the connection parameters using environment variables. A list
    // is available at https://www.postgresql.org/docs/12/libpq-envars.html.
    // Common options: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE.
    return new Sequelize({
      ...sequelizeOptions,

      // The following variables are ignored by node-postgres, hence we have
      // to specify them here.
      host: process.env.PGHOST,
      port: process.env.PGPORT,
    });
  }
})();

const models = {
  Report: sequelize.import('./report'),
  ReportTag: sequelize.import('./report-tag'),
  Publisher: sequelize.import('./publisher'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
