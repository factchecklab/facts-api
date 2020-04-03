import gql from 'graphql-tag';

import entity from './entity';
import topic from './topic';
import response from './response';
import attachment from './attachment';
import asset from './asset';
import message from './message';
import report from './report';

const link = gql`
  scalar Date

  enum Conclusion {
    truthy
    falsy
    uncertain
    disputed
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  #type Subscription {
  #  _: Boolean
  #}
`;

export default [
  link,
  entity,
  topic,
  response,
  attachment,
  asset,
  message,
  report,
];
