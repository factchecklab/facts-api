import { Op } from 'sequelize';

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
