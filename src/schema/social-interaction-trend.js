import gql from 'graphql-tag';

export default gql`
  extend type Query {
    socialInteractionTrend(
      keyword: String
      timeframe: String
    ): SocialInteractionTrend!
  }

  type SocialInteractionTrend {
    dataPoints: [SocialInteractionDataPoint!]!
    total: Int!
  }

  type SocialInteractionDataPoint {
    time: Date!
    value: Int!
  }
`;
