import { ValidationError } from 'apollo-server-koa';
import { NotFound } from './errors';
import {
  stringifyCursor,
  parseRelayPaginationArgs,
  makeRelayConnection,
} from '../util/pagination';
import { buildPagableQuery } from '../models/pagination';
import { cleanUrl } from '../util/url';

export default {
  Query: {
    reports: async (parent, args, { models }) => {
      const pargs = parseRelayPaginationArgs(args);
      const result = await models.Report.findAll(
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

    report: async (parent, { id }, { models, logger }) => {
      const reportId = parseInt(id);
      logger.debug('Get report by id "%s"', reportId);
      const report = await models.Report.findByPk(reportId);
      if (!report) {
        throw new NotFound(`Cannot find report with id "${reportId}"`);
      }
      return report;
    },

    searchRelatedReports: async (
      parent,
      { originalMessage, originalUrl },
      { models, search, elastic }
    ) => {
      if (!originalMessage && !originalUrl) {
        throw new ValidationError(
          'Either "originalMessage" or "originalUrl" must be specified.'
        );
      }

      const docs = await search.Report.searchSimilarByContent(
        elastic,
        originalMessage,
        originalUrl ? cleanUrl(originalUrl) : undefined,
        0,
        5
      );

      const result = await models.Report.findAllByPk(
        docs.map((doc) => doc._source.id)
      );
      return makeRelayConnection(
        result.map((item, i) => {
          return {
            cursor: '',
            score: docs[i]._score,
            node: item,
          };
        })
      );
    },
  },

  Mutation: {
    createReport: (parent, { input }, { sequelize, models, logger }) => {
      const { tags: tagNames, publisherId: pid, ...rest } = input;
      const publisherId = parseInt(pid);

      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };
        if (!(await models.Publisher.findByPk(publisherId, opts))) {
          throw new NotFound(`Cannot find publisher with id "${publisherId}"`);
        }

        let report = models.Report.build({
          ...rest,
          publisherId,
        });

        report = await report.save({
          ...opts,
          returning: true,
        });

        await report.setReportTags(
          await models.ReportTag.findOrCreateByNames(tagNames || [], opts),
          opts
        );

        return { report };
      });
    },

    updateReport: (parent, { input }, { sequelize, models, logger }) => {
      const { id, tags: tagNames, ...rest } = input;
      const reportId = parseInt(id);

      logger.debug('Delete report by id "%s"', reportId);
      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };

        let report = await models.Report.findByPk(reportId, opts);
        if (!report) {
          throw new NotFound(`Cannot find report with id "${reportId}"`);
        }

        if (tagNames) {
          await report.setReportTags(
            await models.ReportTag.findOrCreateByNames(tagNames, opts),
            opts
          );
        }

        report = await report.update(rest, {
          ...opts,
          returning: true,
        });
        return { report };
      });
    },

    deleteReport: (parent, { input }, { sequelize, models, logger }) => {
      const { id } = input;
      const reportId = parseInt(id);
      logger.debug('Delete report by id "%s"', reportId);

      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };
        const report = await models.Report.findByPk(reportId, opts);
        if (!report) {
          throw new NotFound(`Cannot find report with id "${reportId}"`);
        }

        await report.destry(opts);
        return { reportId };
      });
    },
  },

  Report: {
    publisher: (report, args, context) => {
      return report.getPublisher();
    },

    tags: (report, args, context) => {
      return report.getReportTags().map((tag) => tag.name);
    },
  },
};
