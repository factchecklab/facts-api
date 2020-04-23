import gql from 'graphql-tag';

export default gql`
  type SocialGroup {
    platform: SocialPlatform!
    name: String
  }
`;
