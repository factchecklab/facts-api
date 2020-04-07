import { ApolloServer } from 'apollo-server';

import models, { sequelize } from './models';
import schema from './schema';
import resolvers from './resolvers';
import search, { client as elastic, addHooks } from './search';

sequelize.sync();

addHooks(models);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: schema,
  context: () => {
    return {
      models,
      sequelize,
      elastic,
      search,
    };
  },
  resolvers,
});

// The `listen` method launches a web server.
server.listen().then(({ server, url }) => {
  console.log(`🚀  Server ready at ${url}`);

  // For nodemon
  process.once('SIGUSR2', () => {
    server.close(() => {
      process.kill(process.pid, 'SIGUSR2');
    });
  });
});
