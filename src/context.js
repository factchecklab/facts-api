import models, { sequelize } from './models';
import dataPipelineModels from './data-pipeline-models';
import search, { client as elastic } from './search';
import storage from './storage';
import { logger } from './logging';
import airtable from './airtable';

const context = () => {
  return {
    models,
    dataPipelineModels,
    sequelize,
    elastic,
    search,
    storage,
    logger,
    airtable,
  };
};

export default context;
