import gql from 'graphql-tag';

export default gql`
  extend type Query {
    socialPostTrend(keyword: String): [SocialPostDataPoint!]!
  }

  type SocialPostDataPoint {
    time: Date!
    value: Int!
  }
`;
