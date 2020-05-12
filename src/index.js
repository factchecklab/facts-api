import { ApolloServer } from 'apollo-server';

import models, { sequelize } from './models';
import dataPipelineModels from './data-pipeline-models';
import schema from './schema';
import resolvers from './resolvers';
import search, { client as elastic, addHooks } from './search';
import storage from './storage';
import directives from './directives';
import { logger } from './logging';
import { errorLoggingPlugin } from './plugins/error-logging';

addHooks(models);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: schema,
  context: () => {
    return {
      models,
      dataPipelineModels,
      sequelize,
      elastic,
      search,
      storage,
      logger,
    };
  },
  resolvers,
  schemaDirectives: directives,
  introspection: true,
  plugins: [errorLoggingPlugin],
});

// The `listen` method launches a web server.
server
  .listen({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 4000,
  })
  .then(({ server, url }) => {
    console.log(`🚀  Server ready at ${url}`);

    // For nodemon
    process.once('SIGUSR2', () => {
      server.close(() => {
        process.kill(process.pid, 'SIGUSR2');
      });
    });
  });
