import gql from 'graphql-tag';

export default gql`
  extend type Query {
    socialPosts(
      keyword: String
      timeframe: String
      orderBy: SocialPostOrderField
      reverse: Boolean
      after: Cursor
      before: Cursor
      first: Int
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
    Order from high reply count to low reply count.
    """
    reply

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
  interface SocialPost {
    """
    The platform that is hosting the social post.
    """
    platform: SocialPlatform!

    """
    The date and time the social post is posted.
    """
    createdAt: Date!

    """
    The original poster
    """
    poster: SocialUser

    """
    The group in which the post is posted in. Can be null if group does not
    apply for this social post.
    """
    group: SocialGroup @stub

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
    The URL of the post on the social platform.
    """
    platformUrl: URL

    """
    The ID of the social post on the social platform.
    """
    platformId: ID!
  }
`;
