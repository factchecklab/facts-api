import gql from 'graphql-tag';

export default gql`
  enum SocialPlatformName {
    lihkg
  }

  type SocialPlatform {
    name: SocialPlatformName!
  }
`;
