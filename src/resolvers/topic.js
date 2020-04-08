import { ValidationError } from 'apollo-server-koa';
import { Op } from 'sequelize';
import { NotFound } from './errors';

const modifyResponses = async (topic, responsePayloads, models, opts) => {
  const existingResponses = await topic.getResponses(opts);
  await Promise.all(
    responsePayloads.map((response) => {
      return (async () => {
        const { id, entityId, ...rest } = response;

        if (entityId) {
          const entity = await models.Entity.findByPk(entityId, opts);
          if (!entity) {
            throw new NotFound(
              `Could not find an Entity with the id '${entityId}'`
            );
          }
        } else if (!id) {
          throw new ValidationError(
            `To create a response, an entity ID must be specified.`
          );
        }

        if (id) {
          const index = existingResponses.findIndex((r) => {
            return r.id === parseInt(id);
          });
          if (index < 0) {
            throw new NotFound(
              `Could not find a Response with the id '${id} for topic with the id ${topic.id}'`
            );
          }
          const existingResponse = existingResponses[index];
          existingResponses.splice(index, 1);

          await existingResponse.update(
            { ...rest, entityID: entityId || exisitngResponse.entityId },
            { ...opts }
          );
        } else {
          const response = models.Response.build({
            type: 'response',
            published: true, // FIXME(cheungpat): Change to default unpublished
            conclusion: 'uncertain',
            content: '',
            ...rest,
            entityId: entityId,
            topicId: topic.id,
          });
          await response.save({ ...opts });
        }
      })();
    })
  );

  // Delete unreferenced responses
  await Promise.all(
    existingResponses.map((response) => {
      return response.destroy({ ...opts });
    })
  );
};

export default {
  Query: {
    topics: async (
      parent,
      { keyword, offset, limit },
      { models, search, elastic }
    ) => {
      const where = {
        published: true,
      };
      if (keyword) {
        const ids = await search.Topic.searchByKeyword(
          elastic,
          keyword,
          offset,
          limit
        );
        return models.Topic.findAllByDocumentIds(ids, {
          where,
        });
      } else {
        return models.Topic.findAll({
          where,
          offset: offset || 0,
          limit: Math.min(limit || 20, 100),
          order: [['createdAt', 'desc']],
        });
      }
    },

    topic: (parent, { id }, { models }) => {
      return models.Topic.findByPk(id);
    },

    similarTopics: async (
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

      const ids = await search.Topic.searchSimilarByMessageContent(
        elastic,
        report ? report.content : content,
        offset,
        limit
      );
      return models.Topic.findAllByDocumentIds(ids, {
        where: { published: true },
      });
    },
  },

  Mutation: {
    createTopic: (parent, { input }, { sequelize, models }) => {
      const { reportId, message, responses, ...rest } = input;

      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };
        // If a reportId is specified, find the report
        let report = null;
        if (reportId) {
          report = await models.Report.findByPk(reportId, opts);
          if (!report) {
            throw new NotFound(
              `Could not find a Report with the id '${reportId}'`
            );
          }
        }

        // Create a new topic
        const messageContent =
          (report && report.content) || (message && message.content) || '';
        let topic = models.Topic.build(
          {
            title: '',
            published: true, // FIXME(cheungpat): Change to default unpublished
            conclusion: 'uncertain',
            ...rest,
            message: { content: messageContent },
          },
          { include: ['message'] }
        );

        topic = await topic.save({ ...opts, returning: true });

        // Save all accompanying responses
        await modifyResponses(topic, responses, models, opts);

        return { topic };
      });
    },

    updateTopic: (parent, { input }, { models, sequelize }) => {
      const { id, message, responses, ...rest } = input;
      const messageContent = (message && message.content) || undefined;

      return sequelize.transaction(async (t) => {
        const opts = { transaction: t };

        let topic = await models.Topic.findByPk(id, opts);
        if (!topic) {
          throw new NotFound(`Could not find a Topic with the id '${id}'`);
        }
        const message = await topic.getMessage(opts);
        if (messageContent !== undefined) {
          await message.update({ content: messageContent }, opts);
        }
        topic = await topic.update(rest, { ...opts, returning: true });

        // Save all accompanying responses
        await modifyResponses(topic, responses, models, opts);

        return { topic };
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

    coverImage: (topic, args, { models }) => {
      return topic.getCoverImage();
    },
  },
};
