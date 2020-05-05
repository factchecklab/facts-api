import gql from 'graphql-tag';

export default gql`
  type UwantsSocialUser implements SocialUser {
    # interface fields
    name: String
    platform: SocialPlatform!
  }

  type UwantsSocialPost implements SocialPost {
    # interface fields
    platform: SocialPlatform!
    createdAt: Date!
    poster: UwantsSocialUser
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
