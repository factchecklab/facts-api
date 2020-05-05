import gql from 'graphql-tag';

export default gql`
  type LIHKGSocialUser implements SocialUser {
    # interface fields
    name: String
    platform: SocialPlatform!
  }

  type LIHKGSocialPost implements SocialPost {
    # interface fields
    platform: SocialPlatform!
    createdAt: Date!
    poster: LIHKGSocialUser
    group: SocialGroup
    title: String
    content: String
    performance: Float
    platformUrl: URL
    platformId: ID!

    # type fields
    likeCount: Int
    dislikeCount: Int
    replyCount: Int
  }
`;
