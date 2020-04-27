const esQueryObject = (keyword) => {
  /* eslint-disable camelcase */
  const queryObject = {
    bool: {
      must: [{ range: { created_at: { from: 'now-30d' } } }],
    },
  };
  /* eslint-enable camelcase */

  if (keyword) {
    queryObject.bool.must.push({ match: { content: keyword } });
  }
  return queryObject;
};

export default {
  Query: {
    socialInteractionTrend: async (parent, args, { elastic }) => {
      // TODO (samueltangz): support more arguments apart from `keyword`
      // TODO (samueltangz): I think the histogram is bucketed per day in GMT+0.
      // Need to discuss if histogram buckets can be customizable.
      // TODO (samueltangz): the interactions should be calculated by the bucket the interaction
      // is given, instead of the bucket that when the post is created.

      /* eslint-disable camelcase */
      const { body } = await elastic.search({
        index: 'social-posts-*',
        size: 0,
        body: {
          query: esQueryObject(args.keyword),
          aggs: {
            interactions_over_time: {
              date_histogram: {
                field: 'created_at',
                calendar_interval: '1d',
              },
              aggs: {
                xly: {
                  sum: {
                    field: 'interaction_count',
                  },
                },
              },
            },
          },
        },
      });
      /* eslint-enable camelcase */
      const dataPoints = body.aggregations.interactions_over_time.buckets.map(
        (bucket) => {
          return {
            time: new Date(bucket.key),
            value: bucket.xly.value,
          };
        }
      );
      const sumValue = dataPoints.reduce((accumulator, dataPoint) => {
        return accumulator + dataPoint.value;
      }, 0);

      return {
        dataPoints,
        total: sumValue,
      };
    },
  },
};
