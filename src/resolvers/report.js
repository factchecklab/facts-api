import { NotFound } from './errors';
import {
  verify as verifyAssetToken,
  AssetTokenError,
} from '../util/asset-token';
import { ValidationError } from 'apollo-server-koa';

export default {
  Query: {
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

    similarReports: async (
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
    createReport: async (parent, { input }, context) => {
      const { models } = context;
      const { content, source, url, attachments: attachmentInputs } = input;

      const attachments = await Promise.all(
        (attachmentInputs || []).map((attachmentInput) => {
          return (async () => {
            const { type, location, assetToken } = attachmentInput;
            if (type === 'url') {
              return {
                type,
                location,
              };
            } else if (type === 'asset') {
              try {
                return {
                  type,
                  assetId: await verifyAssetToken(assetToken),
                };
              } catch (error) {
                if (error instanceof AssetTokenError) {
                  throw new ValidationError(error.toString());
                }
                throw error;
              }
            } else {
              throw new Error(`Unexpected attachment type ${type}.`);
            }
          })();
        })
      );

      const report = models.Report.build(
        { content, source, url, attachments },
        { include: ['attachments'] }
      );
      await report.save({ returning: true });
      return { report };
    },

    closeReports: async (parent, { input }, { models }) => {
      const { reportIds } = input;

      const reports = await models.Report.findAll({ where: { id: reportIds } });
      // TODO(cheungpat): Ensure all requested reports are found.
      reports.forEach((report) => {
        report.closed = true;
      });
      await Promise.all(
        reports.map((report) => {
          return report.save();
        })
      );
      return {};
    },

    reopenReports: async (parent, { input }, { models }) => {
      const { reportIds } = input;

      const reports = await models.Report.findAll({ where: { id: reportIds } });
      // TODO(cheungpat): Ensure all requested reports are found.
      reports.forEach((report) => {
        report.closed = false;
      });
      await Promise.all(
        reports.map((report) => {
          return report.save();
        })
      );
      return {};
    },

    addReportsToTopic: async (parent, { input }, { models }) => {
      const { reportIds, topicId } = input;

      const topic = await models.Topic.findByPk(topicId);
      const reports = await models.Report.findAll({ where: { id: reportIds } });
      // TODO(cheungpat): Ensure all requested reports are found.
      reports.forEach((report) => {
        report.setTopic(topic);
        report.closed = true;
      });
      await Promise.all(
        reports.map((report) => {
          return report.save();
        })
      );
      return {};
    },

    removeReportsFromTopic: async (parent, { input }, { models }) => {
      const { reportIds } = input;

      const reports = await models.Report.findAll({ where: { id: reportIds } });
      // TODO(cheungpat): Ensure all requested reports are found.
      reports.forEach((report) => {
        report.setTopic(null);
        report.closed = false;
      });
      await Promise.all(
        reports.map((report) => {
          return report.save();
        })
      );
      return {};
    },
  },

  Report: {
    topic: (report, args, { models }) => {
      return report.getTopic();
    },

    attachments: (report, args, { models }) => {
      return report.getAttachments();
    },

    similarTopics: async (report, args, { models, search, elastic }) => {
      const ids = await search.Topic.searchSimilarByMessageContent(
        elastic,
        report.content
      );
      return models.Topic.findAllByDocumentIds(ids);
    },
  },
};
