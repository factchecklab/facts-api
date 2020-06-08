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
    /*
    reports: async (
      parent,
      { keyword, closed, offset, limit },
      { models, search, elastic }
    ) => {
      if (keyword) {
        const ids = await search.Report.searchByKeyword(
          elastic,
          keyword,
          closed,
          offset,
          limit
        );
        return models.Report.findAllByDocumentIds(ids);
      } else {
        let where = {
          closed: closed || false,
        };

        return models.Report.findAll({
          where,
          offset: offset || 0,
          limit: Math.min(limit || 20, 100),
          order: [['createdAt', 'desc']],
        });
      }
    },

    report: (parent, { id }, { models }) => {
      return models.Report.findByPk(id);
    },

    searchRelatedReports: async (
      parent,
      { reportId, content, offset, limit },
      { models, search, elastic }
    ) => {
      let report = null;
      if (reportId) {
        report = await models.Report.findByPk(reportId);
        if (!report) {
          throw new NotFound(
            `Could not find a Report with the id '${reportId}'`
          );
        }
      }
      const ids = await search.Report.searchSimilarByContent(
        elastic,
        report ? report.documentId : null,
        content,
        offset,
        limit
      );
      return models.Report.findAllByDocumentIds(ids);
    },
    */
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
