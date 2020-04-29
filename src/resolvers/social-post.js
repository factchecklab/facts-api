import { timeframes } from '../search/social-weather';

const stringifyCursor = (cursor) => {
  return Buffer.from(JSON.stringify(cursor)).toString('base64');
};

const parsePagingCursor = (cursorString) => {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursorString, 'base64').toString('ascii')
    );
    return Array.isArray(parsed) ? parsed : undefined;
  } catch (e) {
    return undefined;
  }
};

const esSortObject = (orderBy, reverse) => {
  // Default sort field, also used for sorting if the primary sort field
  // is the same (post published at the same time).
  const sort = [
    {
      _id: reverse ? 'desc' : 'asc',
    },
  ];

  switch (orderBy) {
    case 'performance':
      sort.unshift({
        'performance.reply': {
          order: reverse ? 'asc' : 'desc',
        },
      });
      break;
    case 'reaction':
      sort.unshift({
        // eslint-disable-next-line camelcase
        reaction_count: {
          order: reverse ? 'asc' : 'desc',
        },
      });
      break;
    case 'reply':
      sort.unshift({
        // eslint-disable-next-line camelcase
        reply_count: {
          order: reverse ? 'asc' : 'desc',
        },
      });
      break;
    case 'newest':
    // 'newest' is also the default, fallthrough
    default:
      sort.unshift({
        // eslint-disable-next-line camelcase
        created_at: {
          order: reverse ? 'asc' : 'desc',
        },
      });
      break;
  }
  return sort;
};

const esQueryObject = (keyword, timeframe) => {
  /* eslint-disable camelcase */
  const queryObject = {
    bool: {
      must: [{ range: { created_at: { from: timeframe.from } } }],
    },
  };
  /* eslint-enable camelcase */

  if (keyword) {
    // TODO (samueltangz): keyword should be searching `title`s as well
    queryObject.bool.must.push({ match: { content: keyword } });
  }
  return queryObject;
};

export default {
  Query: {
    socialPosts: async (parent, args, { elastic }) => {
      const forward = !!args.after || !args.before;
      const afterCursor = args.after || args.before || undefined;
      const reverse = !forward || args.reverse;
      const size = args.first || 10;
      const timeframe = timeframes[args.timeframe] || timeframes['30d'];

      const { body } = await elastic.search({
        index: 'social-posts-*',
        size: size + 1, // +1 to find out if more data is available
        body: {
          query: esQueryObject(args.keyword, timeframe),
          sort: esSortObject(args.orderBy, reverse),
          /* eslint-disable-next-line camelcase */
          search_after: afterCursor
            ? parsePagingCursor(afterCursor)
            : undefined,
        },
      });

      const result = body.hits.hits;
      const hasMore = result.length > size;
      result.splice(size);
      if (!forward) {
        result.reverse();
      }

      const edges = result.map(({ _source: doc, sort }) => {
        return {
          cursor: stringifyCursor(sort),
          node: {
            createdAt: new Date(doc.created_at),
            title: doc.title,
            content: doc.content,
            platform: {
              name: 'lihkg',
            },
            poster: {
              name: (doc.user && doc.user.name) || null,
            },
            group: doc.group && {
              platform: {
                name: 'lihkg',
              },
              name: doc.group.name,
            },
            performance: (doc.performance && doc.performance.reply) || null,
            likeCount: doc.like_count,
            dislikeCount: doc.dislike_count,
            replyCount: doc.reply_count,
            platformUrl: `https://lihkg.com/thread/${doc.post_id}`,
            platformId: `${doc.post_id}`,
          },
        };
      });

      return {
        edges,
        nodes: edges.map((edge) => {
          return edge.node;
        }),
        pageInfo: {
          startCursor:
            result.length > 0 ? stringifyCursor(result[0].sort) : null,
          endCursor:
            result.length > 0
              ? stringifyCursor(result[result.length - 1].sort)
              : null,
          hasNextPage: forward && hasMore,
          hasPreviousPage: !forward && hasMore,
        },
        totalCount: body.hits.total.value,
      };
    },
  },

  SocialPost: {
    __resolveType: (obj) => {
      if (obj.platform.name === 'lihkg') {
        return 'LIHKGSocialPost';
      }
      return null;
    },
  },
};
