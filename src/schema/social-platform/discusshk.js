import gql from 'graphql-tag';

export default gql`
  type DiscussHKSocialUser implements SocialUser {
    # interface fields
    name: String
    platform: SocialPlatform!
  }

  type DiscussHKSocialPost implements SocialPost {
    # interface fields
    platform: SocialPlatform!
    createdAt: Date!
    poster: DiscussHKSocialUser
    group: SocialGroup
    title: String
    content: String
    performance: Float
    platformUrl: URL
    platformId: ID!

    # type fields
    viewCount: Int
    replyCount: Int
  }
`;
