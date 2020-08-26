// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { NotFound } from './errors';
import {
  stringifyCursor,
  parseRelayPaginationArgs,
  makeRelayConnection,
} from '../util/pagination';
import { buildPagableQuery } from '../models/pagination';

export default {
  Query: {
    publishers: async (parent, args, { models }) => {
      const pargs = parseRelayPaginationArgs(args);
      const result = await models.Publisher.findAll(
        buildPagableQuery(pargs, ['name', 'asc'])
      );

      return makeRelayConnection(
        result.map((item) => {
          return {
            cursor: stringifyCursor([item.name, item.id]),
            node: item,
          };
        }),
        pargs
      );
    },

    publisher: async (parent, { id }, { models, logger }) => {
      const publisherId = parseInt(id);
      logger.debug('Get publisher by id "%s"', publisherId);
      const publisher = await models.Publisher.findByPk(publisherId);
      if (!publisher) {
        throw new NotFound(`Cannot find publisher with id "${publisherId}"`);
      }
      return publisher;
    },
  },

  Publisher: {
    reports: async (obj, args, { models }) => {
      const pargs = parseRelayPaginationArgs(args);
      const result = await obj.getReports(
        buildPagableQuery(pargs, ['publishedAt', 'asc'])
      );

      return makeRelayConnection(
        result.map((item) => {
          return {
            cursor: stringifyCursor([item.publishedAt, item.id]),
            node: item,
          };
        }),
        pargs
      );
    },
  },
};
