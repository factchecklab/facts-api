import dotenv from 'dotenv';

import { timeframes, defaultTimeframe } from '../search/social-weather';

dotenv.config();

const esQueryObject = (keyword, timeframe) => {
  /* eslint-disable camelcase */
  const queryObject = {
    bool: {
      must: [{ range: { created_at: { from: timeframe.from } } }],
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
    socialPostTrend: async (parent, args, { elastic }) => {
      // TODO (samueltangz): support more arguments apart from `keyword`

      const timeframe =
        timeframes[args.timeframe] || timeframes[defaultTimeframe];

      /* eslint-disable camelcase */
      const { body } = await elastic.search({
        index: 'social-posts-*',
        size: 0,
        body: {
          query: esQueryObject(args.keyword, timeframe),
          aggs: {
            posts_over_time: {
              date_histogram: {
                field: 'created_at',
                calendar_interval: timeframe.interval,
                time_zone: process.env.ELASTICSEARCH_TIMEZONE || '+00:00',
              },
            },
          },
        },
      });
      /* eslint-enable camelcase */
      const dataPoints = body.aggregations.posts_over_time.buckets.map(
        (bucket) => {
          return {
            time: new Date(bucket.key),
            value: bucket.doc_count,
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
