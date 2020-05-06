import dotenv from 'dotenv';
import Sequelize from 'sequelize';

import {
  timeframes,
  defaultTimeframe,
  reactionDeltaModels,
} from '../search/social-weather';

const INTERACTION_SAMPLE_SIZE = 1000;

const { Op } = Sequelize;
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
    socialInteractionTrend: async (
      parent,
      args,
      { dataPipelineModels, elastic }
    ) => {
      // TODO (samueltangz): support more arguments apart from `keyword`

      const timeframe =
        timeframes[args.timeframe] || timeframes[defaultTimeframe];

      /* eslint-disable camelcase */
      const { body } = await elastic.search({
        index: 'social-posts-*',
        size: INTERACTION_SAMPLE_SIZE,
        _source: false,
        body: {
          query: esQueryObject(args.keyword, timeframe),
          sort: [{ interaction_count: { order: 'desc' } }],
          aggs: { total_interactions: { sum: { field: 'interaction_count' } } },
        },
      });
      const threadIds = body.hits.hits.map((posts) => posts._id);
      const totalInteractions = body.aggregations.total_interactions.value;

      const reactionDeltaModel =
        dataPipelineModels[reactionDeltaModels[timeframe.unit]];

      const reactionDeltas = await reactionDeltaModel.findAll({
        attributes: [
          'time',
          [Sequelize.fn('sum', Sequelize.col('value')), 'value'],
        ],
        where: {
          identifier: {
            [Op.in]: threadIds,
          },
        },
        group: ['time'],
        order: [[Sequelize.col('time'), 'ASC']],
      });
      /* eslint-enable camelcase */

      const dataPoints = reactionDeltas.map((reactionDelta) => {
        return {
          time: reactionDelta.dataValues.time,
          value: parseInt(reactionDelta.dataValues.value, 10),
        };
      });
      const partialTotalInteractions = dataPoints.reduce(
        (accumulator, dataPoint) => {
          return accumulator + dataPoint.value;
        },
        0
      );

      const scaledDataPoints = dataPoints.map(({ time, value }) => {
        return {
          time,
          value: Math.round(
            (value * totalInteractions) / partialTotalInteractions
          ),
        };
      });

      return {
        dataPoints: scaledDataPoints,
        total: totalInteractions,
      };
    },
  },
};
