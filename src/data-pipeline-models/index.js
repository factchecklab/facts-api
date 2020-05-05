import dotenv from 'dotenv';
import Sequelize from 'sequelize';

dotenv.config();

const sequelizeOptions = {
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
  },
};

const sequelize = (() => {
  return new Sequelize(process.env.PIPELINE_DATABASE_URL, sequelizeOptions);
})();

const models = {
  ReactionDelta: sequelize.import('./reaction-delta'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
