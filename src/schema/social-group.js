import gql from 'graphql-tag';

export default gql`
  extend type Query {
    socialGroups: SocialGroupConnection!
  }

  type SocialGroupConnection {
    edges: [SocialGroupEdge!]
    nodes: [SocialGroup!]
    totalCount: Int!
  }

  type SocialGroupEdge {
    cursor: String!
    node: SocialGroup!
  }

  type SocialGroup {
    id: ID!
    name: String!
    platformId: String!
    platform: SocialPlatform!
  }
`;
