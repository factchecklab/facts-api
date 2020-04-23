import gql from 'graphql-tag';

export default gql`
  extend type Query {
    socialPosts(
      keywords: String
      orderBy: SocialPostOrderField
      reverse: Boolean
      after: Cursor
      first: Int
      before: Cursor
      last: Int
    ): SocialPostConnection!
  }

  enum SocialPostOrderField {
    """
    Order from high performance to low performance.
    """
    performance

    """
    Order from high reaction count to low reaction count.
    """
    reaction

    """
    Order from high comment count to low comment count.
    """
    comment

    """
    Order from high share count to low share count.
    """
    share

    """
    Order from newest to oldest.
    """
    newest
  }

  type SocialPostConnection {
    edges: [SocialPostEdge!]
    nodes: [SocialPost!]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type SocialPostEdge {
    cursor: String!
    node: SocialPost!
  }

  """
  Contains information of a social post.
  """
  type SocialPost {
    """
    The platform that is hosting the social post.
    """
    platform: SocialPlatform!

    """
    The date and time the social post is posted.
    """
    postedAt: Date!

    """
    The original poster
    """
    poster: SocialPoster

    """
    The group in which the post is posted in. Can be null if group does not
    apply for this social post.
    """
    group: SocialGroup

    """
    The title of the social post.
    """
    title: String

    """
    The content of the social post.
    """
    content: String

    """
    The multiplier showing relative trend of this post relative to other post.
    """
    performance: Float

    """
    Comment count. If the platform does not support reaction, this can be null.
    """
    reactionCount: Int

    """
    Comment count. If the platform does not support comment, this can be null.
    """
    commentCount: Int

    """
    Share count. If the platform does not support sharing, this can be null.
    """
    shareCount: Int
  }
`;
