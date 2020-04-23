export default {
  Query: {
    socialPosts: () => {
      return {
        nodes: [
          {
            postedAt: new Date(),
            platform: {
              name: 'lihkg',
            },
          },
        ],
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
  SocialPostConnection: {
    edges: (parent) => {
      return parent.nodes.map((node) => {
        return {
          cursor: '42',
          node: node,
        };
      });
    },
    pageInfo: (parent, args, context, info) => {
      return {
        startCursor: '42',
        endCursor: '42',
        hasNextPage: false,
        hasPreviousPage: false,
      };
    },
    totalCount: () => {
      return 42;
    },
  },
};
