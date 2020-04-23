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

  // TODO(cheungpat): Implement other sorting. The following code sort by newest.
  sort.unshift({
    time: {
      order: reverse ? 'asc' : 'desc',
    },
  });
  return sort;
};

const esQueryObject = (keyword) => {
  return keyword
    ? {
        /* eslint-disable-next-line camelcase */
        multi_match: {
          query: keyword,
          fields: ['title', 'content'],
        },
      }
    : undefined;
};

export default {
  Query: {
    socialPosts: async (parent, args, { elastic }) => {
      const forward = !!args.after || !args.before;
      const afterCursor = args.after || args.before || undefined;
      const reverse = !forward || args.reverse;
      const size = args.first || 10;

      const { body } = await elastic.search({
        index: 'threads',
        size: size + 1, // +1 to find out if more data is available
        body: {
          query: esQueryObject(args.keyword),
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
            postedAt: new Date(doc.time),
            title: doc.title,
            content: doc.content,
            platform: {
              name: 'lihkg',
            },
            poster: {
              name: doc.author,
            },
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
    platform: () => {
      // TODO(cheungpat): Get social platform info
      return {
        name: 'lihkg',
      };
    },
  },
};
