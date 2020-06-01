import dotenv from 'dotenv';
import Sequelize from 'sequelize';

import {
  timeframes,
  defaultTimeframe,
  reactionDeltaModels,
  esQueryObject,
} from '../search/social-weather';
import { padBuckets } from '../util/social-weather';

const INTERACTION_SAMPLE_SIZE = 1000;

const { Op } = Sequelize;
dotenv.config();

export default {
  Query: {
    socialInteractionTrend: async (
      parent,
      args,
      { dataPipelineModels, elastic }
    ) => {
      const timeframe =
        timeframes[args.timeframe] || timeframes[defaultTimeframe];

      /* eslint-disable camelcase */
      const { body } = await elastic.search({
        index: 'social-posts-*',
        size: INTERACTION_SAMPLE_SIZE,
        _source: false,
        body: {
          query: esQueryObject(args.query, timeframe),
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
        dataPoints: padBuckets(scaledDataPoints, timeframe),
        total: totalInteractions,
      };
    },
  },
};
