import gql from 'graphql-tag';

export default gql`
  directive @stub on FIELD_DEFINITION | ARGUMENT_DEFINITION
`;
