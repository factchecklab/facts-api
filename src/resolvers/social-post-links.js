import {
  timeframes,
  defaultTimeframe,
  esQueryObject,
} from '../search/social-weather';

export default {
  Query: {
    socialPostLinks: async (parent, args, { elastic }) => {
      const timeframe =
        timeframes[args.timeframe] || timeframes[defaultTimeframe];

      /* eslint-disable camelcase */
      const { body } = await elastic.search({
        index: 'social-posts-*',
        size: 0,
        body: {
          query: esQueryObject(args.query, timeframe),
          aggs: {
            links: {
              terms: {
                field: 'content_urls.keyword',
                size: 50,
              },
            },
          },
        },
      });
      /* eslint-enable camelcase */
      const links = body.aggregations.links.buckets.map((bucket) => {
        // buckets returns `key` (string), doc_count, bg_count (int), score (float)
        return {
          link: bucket.key,
          count: bucket.doc_count,
        };
      });

      return { links };
    },
  },
};
