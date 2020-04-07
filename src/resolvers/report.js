import { Op } from 'sequelize';

export default {
  Query: {
    reports: (parent, { keyword, closed, offset, limit }, { models }) => {
      let where = {
        closed: closed || false,
      };

      if (keyword) {
        where.content = {
          [Op.like]: `%${keyword}%`,
        };
      }

      return models.Report.findAll({
        where,
        offset: offset || 0,
        limit: Math.min(limit || 20, 100),
        order: [['createdAt', 'desc']],
      });
    },

    report: (parent, { id }, { models }) => {
      return models.Report.findByPk(id);
    },
  },

  Mutation: {
    createReport: async (parent, { input }, { models }) => {
      const { content, source, url } = input;

      const report = models.Report.build({ content, source, url });
      await report.save();
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
      return models.Topic.findAllByDocumentIds(ids, {
        where: { published: true },
      });
    },
  },
};
