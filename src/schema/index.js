import gql from 'graphql-tag';

import directives from './directives';
import pagination from './pagination';
import conclusion from './conclusion';
import report from './report';
import reportTag from './report-tag';
import publisher from './publisher';

const link = gql`
  scalar Date
  scalar URL

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export default [
  link,
  directives,
  pagination,
  conclusion,
  report,
  reportTag,
  publisher,
];
