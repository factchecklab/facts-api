const stringifyCursor = (cursor) => {
  return Buffer.from(JSON.stringify(cursor)).toString('base64');
};

export default {
  Query: {
    socialGroups: async (parent, args, { elastic }) => {
      /* eslint-disable camelcase */
      const { body } = await elastic.search({
        index: 'social-groups',
        size: 1000,
        body: {
          sort: [{ _id: 'asc' }],
        },
      });

      const result = body.hits.hits;

      const edges = result.map((doc) => {
        const { _source, sort } = doc;
        return {
          cursor: stringifyCursor(sort),
          node: {
            id: doc._id,
            name: _source.group_name,
            platformId: _source.platform_id,
            platform: { name: _source.platform_name },
          },
        };
      });
      /* eslint-enable camelcase */

      return {
        edges,
        nodes: edges.map((edge) => {
          return edge.node;
        }),
        totalCount: body.hits.total.value,
      };
    },
  },
};
