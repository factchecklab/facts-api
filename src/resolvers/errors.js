import { ApolloError } from 'apollo-server-koa';

export class NotFound extends ApolloError {
  constructor(message, props) {
    super(message, 'NOT_FOUND', props);
  }
}
