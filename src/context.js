import models, { sequelize } from './models';
import search, { client as elastic } from './search';
import storage from './storage';
import { logger } from './logging';

const context = () => {
  return {
    models,
    sequelize,
    elastic,
    search,
    storage,
    logger,
  };
};

export default context;
