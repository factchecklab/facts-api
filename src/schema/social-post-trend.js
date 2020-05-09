import gql from 'graphql-tag';

export default gql`
  extend type Query {
    socialPostTrend(query: String, timeframe: String): SocialPostTrend!
  }

  type SocialPostTrend {
    dataPoints: [SocialPostDataPoint!]!
    total: Int!
  }

  type SocialPostDataPoint {
    time: Date!
    value: Int!
  }
`;
