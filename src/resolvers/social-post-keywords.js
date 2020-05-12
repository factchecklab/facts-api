import {
  timeframes,
  defaultTimeframe,
  esQueryObject,
} from '../search/social-weather';

export default {
  Query: {
    socialPostKeywords: async (parent, args, { elastic }) => {
      const timeframe =
        timeframes[args.timeframe] || timeframes[defaultTimeframe];

      /* eslint-disable camelcase */
      const { body } = await elastic.search({
        index: 'social-posts-*',
        size: 0,
        body: {
          query: esQueryObject(args.query, timeframe),
          aggs: {
            top_keywords: {
              significant_terms: {
                field: 'content',
                size: 50,
              },
            },
          },
        },
      });
      /* eslint-enable camelcase */
      const keywords = body.aggregations.top_keywords.buckets.map((bucket) => {
        // buckets returns `key` (string), doc_count, bg_count (int), score (float)
        return {
          keyword: bucket.key,
          score: bucket.score,
        };
      });

      return { keywords };
    },
  },
};
