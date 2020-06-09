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

        let reportTags = [];
        if (tagNames) {
          reportTags = await Promise.all(
            tagNames.map(async (tagName) => {
              const attrs = {
                name: tagName.trim(),
              };
              const tags = await models.ReportTag.findOrCreate({
                ...opts,
                where: attrs,
                defaults: attrs,
              });
              return tags[0];
            })
          );
        }

        let report = models.Report.build({ ...rest, publisherId });

        report = await report.save({
          ...opts,
          returning: true,
        });

        await report.setReportTags(reportTags, { ...opts });

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
            await Promise.all(
              tagNames.map(async (tagName) => {
                const attrs = {
                  name: tagName.trim(),
                };
                const tags = await models.ReportTag.findOrCreate({
                  ...opts,
                  where: attrs,
                  defaults: attrs,
                });
                return tags[0];
              }),
              opts
            )
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
