import dotenv from 'dotenv';
import Sequelize from 'sequelize';

dotenv.config();

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    define: {
      timestamps: false,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.TEST_DATABASE || process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      dialect: 'postgres',
      define: {
        timestamps: false,
      },
    }
  );
}

const models = {
  Asset: sequelize.import('./asset'),
  Attachment: sequelize.import('./attachment'),
  Entity: sequelize.import('./entity'),
  Message: sequelize.import('./message'),
  Report: sequelize.import('./report'),
  Response: sequelize.import('./response'),
  Topic: sequelize.import('./topic'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
