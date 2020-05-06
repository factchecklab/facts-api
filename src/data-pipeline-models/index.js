import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import { parse } from '../util/database-connection-string';

dotenv.config();

const sequelizeOptions = {
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
  },
};

const sequelize = (() => {
  return new Sequelize({
    ...parse(process.env.PIPELINE_DATABASE_URL),
    ...sequelizeOptions,
  });
})();

const models = {
  HourlyReactionDelta: sequelize.import('./hourly-reaction-delta'),
  DailyReactionDelta: sequelize.import('./daily-reaction-delta'),
  MonthlyReactionDelta: sequelize.import('./monthly-reaction-delta'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
