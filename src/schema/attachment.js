import gql from 'graphql-tag';

export default gql`
  type Attachment {
    id: ID!
    type: String!
    location: String
    asset: Asset
  }
`;
