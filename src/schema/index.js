import gql from 'graphql-tag';

import partner from './partner';
import book from './book';
import topic from './topic';
import report from './report';
import response from './response';
import attachment from './attachment';
import asset from './asset';

const link = gql`
  #scalar Date

  enum Conclusion {
    truthy
    falsy
    uncertain
    disputed
  }

  type Query {
    _: Boolean
  }

  #type Mutation {
  #  _: Boolean
  #}

  #type Subscription {
  #  _: Boolean
  #}
`;

export default [
  link,
  partner,
  book,
  topic,
  report,
  response,
  attachment,
  asset
];

