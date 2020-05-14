import gql from 'graphql-tag';

export default gql`
  extend type Query {
    socialPostLinks(query: String, timeframe: String): SocialPostLinks
  }

  type SocialPostLinks {
    links: [SocialPostLink]
  }

  type SocialPostLink {
    link: String!
    count: Int!
  }
`;
