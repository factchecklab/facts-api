import gql from 'graphql-tag';

export default gql`
  type GenericSocialUser implements SocialUser {
    # interface fields
    name: String
    platform: SocialPlatform!
  }

  type GenericSocialPost implements SocialPost {
    # interface fields
    platform: SocialPlatform!
    createdAt: Date!
    poster: GenericSocialUser
    group: SocialGroup
    title: String
    content: String
    performance: Float
    platformUrl: URL
    platformId: ID!
  }
`;
