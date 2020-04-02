import dotenv from 'dotenv';
import Sequelize from 'sequelize';

dotenv.config();

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  });
} else {
  sequelize = new Sequelize(
    process.env.TEST_DATABASE || process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      dialect: 'postgres',
    },
  );
}

const models = {
  Topic: sequelize.import('./topic'),
  Report: sequelize.import('./report'),
  Asset: sequelize.import('./asset'),
  Attachment: sequelize.import('./attachment'),
  Partner: sequelize.import('./partner'),
  ReportLog: sequelize.import('./report_log'),
  Response: sequelize.import('./response')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
