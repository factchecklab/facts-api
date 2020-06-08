import { ApolloServer } from 'apollo-server';

import schema from './schema';
import resolvers from './resolvers';
import directives from './directives';
import { errorLoggingPlugin } from './plugins/error-logging';
import context from './context';

const server = new ApolloServer({
  typeDefs: schema,
  context,
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
