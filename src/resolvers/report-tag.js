// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  stringifyCursor,
  parseRelayPaginationArgs,
  makeRelayConnection,
} from '../util/pagination';
import { buildPagableQuery } from '../models/pagination';

export default {
  Query: {
    reportTags: async (parent, args, { models }) => {
      const pargs = parseRelayPaginationArgs(args);
      const result = await models.ReportTag.findAll(
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
    reportTag: async (parent, { name }, { models, logger }) => {
      logger.debug('Get report tag by name "%s"', name);
      const tag = await models.ReportTag.findOne({ where: { name } });
      return tag;
    },
  },

  ReportTag: {
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
