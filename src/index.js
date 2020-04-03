import { ApolloServer } from 'apollo-server';

import models, { sequelize } from './models';
import schema from './schema';
import resolvers from './resolvers';

sequelize.sync();

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: schema,
  context: () => {
    return {
      models,
    };
  },
  resolvers,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
