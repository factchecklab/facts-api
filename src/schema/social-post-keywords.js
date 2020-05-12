import gql from 'graphql-tag';

export default gql`
  extend type Query {
    socialPostKeywords(query: String, timeframe: String): SocialPostKeywords!
  }

  type SocialPostKeywords {
    keywords: [SocialPostKeyword!]!
  }

  type SocialPostKeyword {
    keyword: String!
    score: Float!
  }
`;
