import gql from 'graphql-tag';

export default gql`
  extend type Query {
    socialGroups: [SocialGroup!]
  }

  type SocialGroup {
    platform: SocialPlatform!
    group_id: Int
    name: String
  }
`;
