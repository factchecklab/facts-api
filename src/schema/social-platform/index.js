import gql from 'graphql-tag';

export default gql`
  enum SocialPlatformName {
    lihkg
    discusshk
    uwants
  }

  type SocialPlatform {
    name: SocialPlatformName!
  }
`;
