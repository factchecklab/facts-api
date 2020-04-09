import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    uploadAsset(file: Upload!): Asset!
  }

  type Asset {
    id: ID!
    contentType: String!
    filename: String!
    url: String!
  }
`;
