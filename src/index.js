import { ApolloServer } from 'apollo-server';

import hooks from './models/hooks';
import schema from './schema';
import resolvers from './resolvers';
import directives from './directives';
import { errorLoggingPlugin } from './plugins/error-logging';
import context from './context';

hooks.forEach((hook) => {
  const ctx = context();
  hook(ctx.models, ctx);
});

const server = new ApolloServer({
  typeDefs: schema,
  context,
  resolvers,
  schemaDirectives: directives,
  introspection: true,
  plugins: [errorLoggingPlugin],
  cacheControl: {
    defaultMaxAge: parseInt(process.env.DEFAULT_CACHE_CONTROL_MAX_AGE) || 0,
  },
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
