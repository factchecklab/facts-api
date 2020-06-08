import gql from 'graphql-tag';

export default gql`
  enum Conclusion {
    truthy
    falsy
    uncertain
    disputed
  }
`;
