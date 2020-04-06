import { Op } from 'sequelize';
import { NotFound } from './errors';

export default {
  Query: {
    topics: (parent, { keyword, closed, offset, limit }, { models }) => {
      let where = {
        published: true,
      };

      if (keyword) {
        where.title = {
          [Op.like]: `%${keyword}%`,
        };
      }

      return models.Topic.findAll({
        where,
        offset: offset || 0,
        limit: Math.min(limit || 20, 100),
        order: [['createdAt', 'desc']],
      });
    },

    topic: (parent, { id }, { models }) => {
      return models.Topic.findByPk(id);
    },

    similarTopics: (parent, { content, url, reportId }, { models }) => {
      // TODO(cheungpat): Implement similarity search
      return models.Topic.findAll({
        limit: 20,
        order: [['createdAt', 'desc']],
      });
    },
  },

  Mutation: {
    createTopic: (parent, { input }, { sequelize, models }) => {
      const { reportId, message, ...rest } = input;

      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };
        let report = null;
        if (reportId) {
          report = await models.Report.findByPk(reportId, opts);
          if (!report) {
            throw new NotFound(
              `Could not find a Report with the id '${reportId}'`
            );
          }
        }

        const messageContent =
          (report && report.content) || (message && message.content) || '';
        const topic = models.Topic.build(
          {
            title: '',
            published: false,
            conclusion: 'uncertain',
            ...rest,
            message: { content: messageContent },
          },
          { include: ['message'] }
        );

        const savedTopic = await topic.save({ ...opts, returning: true });
        if (report) {
          await savedTopic.addReport(report, opts);
        }

        return { topic: savedTopic };
      });
    },

    updateTopic: (parent, { input }, { models, sequelize }) => {
      const { id, message, ...rest } = input;
      const messageContent = (message && message.content) || undefined;

      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };

        const topic = await models.Topic.findByPk(id, opts);
        if (!topic) {
          throw new NotFound(`Could not find a Topic with the id '${id}'`);
        }
        const message = await topic.getMessage(opts);
        if (messageContent !== undefined) {
          await message.update({ content: messageContent }, opts);
        }
        return {
          topic: await topic.update(rest, { ...opts, returning: true }),
        };
      });
    },

    deleteTopic: (parent, { input }, { models, sequelize }) => {
      const { id } = input;
      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };
        const topic = await models.Topic.findByPk(id, opts);
        if (!topic) {
          throw new NotFound(`Could not find a Topic with the id '${id}'`);
        }
        await topic.destroy(opts);
        return { topicId: id };
      });
    },
  },

  Topic: {
    message: (topic, args, { models }) => {
      return topic.getMessage();
    },

    responses: (topic, args, { models }) => {
      return topic.getResponses();
    },

    reports: (topic, args, { models }) => {
      return topic.getReports();
    },
  },
};
