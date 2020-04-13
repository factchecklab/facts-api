import { ValidationError } from 'apollo-server-koa';
import { Op } from 'sequelize';
import { NotFound } from './errors';
import {
  verify as verifyAssetToken,
  AssetTokenError,
} from '../util/asset-token';

const modifyResponses = async (topic, responsePayloads, models, opts) => {
  const existingResponses = await topic.getResponses({ ...opts, scope: null });
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
              `Could not find a Response with the id ${id} for topic with the id ${topic.id}'`
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
      { keyword, includeUnpublished, offset, limit },
      { models, search, elastic }
    ) => {
      let { Topic } = models;
      if (includeUnpublished) {
        Topic = Topic.unscoped();
      }

      if (keyword) {
        const ids = await search.Topic.searchByKeyword(
          elastic,
          keyword,
          offset,
          limit
        );
        return Topic.findAllByDocumentIds(ids);
      } else {
        return Topic.findAll({
          offset: offset || 0,
          limit: Math.min(limit || 20, 100),
          order: [['createdAt', 'desc']],
        });
      }
    },

    topic: (parent, { id }, { models }) => {
      const { Topic } = models;
      return Topic.findByPk(id);
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
      return models.Topic.findAllByDocumentIds(ids);
    },
  },

  Mutation: {
    createTopic: (parent, { input }, { sequelize, models }) => {
      const { reportId, message, responses, coverImage, ...rest } = input;

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

        if (coverImage) {
          try {
            rest.coverImageAssetId = await verifyAssetToken(coverImage.token);
          } catch (error) {
            if (error instanceof AssetTokenError) {
              throw new ValidationError(error.toString());
            }
            throw error;
          }
        }

        let topic = models.Topic.build(
          {
            title: '',
            conclusion: 'uncertain',
            ...rest,
            message: { content: messageContent },
          },
          { include: ['message'] }
        );

        topic = await topic.save({ ...opts, returning: true });

        // Save all accompanying responses
        if (responses) {
          await modifyResponses(topic, responses, models, opts);
        }

        return { topic };
      });
    },

    updateTopic: (parent, { input }, context) => {
      const { models, sequelize } = context;
      const { id, message, responses, coverImage, ...rest } = input;
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

        if (coverImage && parseInt(coverImage.id) !== topic.coverImageAssetId) {
          try {
            rest.coverImageAssetId = await verifyAssetToken(coverImage.token);
          } catch (error) {
            if (error instanceof AssetTokenError) {
              throw new ValidationError(error.toString());
            }
            throw error;
          }
        } else if (coverImage === null) {
          rest.coverImageAssetId = null;
        }

        topic = await topic.update(rest, { ...opts, returning: true });

        // Save all accompanying responses
        if (responses) {
          // If array is specified, `responses` is truthy, and all existing
          // responses will be destroyed.
          // It no array is specified, this block is not executed and no
          // respones will be modified.
          await modifyResponses(topic, responses, models, opts);
        }

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

    responses: (topic, { includeUnpublished }, { models }) => {
      let { Response } = models;
      if (includeUnpublished) {
        return topic.getResponses({ scope: null });
      } else {
        return topic.getResponses();
      }
    },

    reports: (topic, args, { models }) => {
      return topic.getReports();
    },

    coverImage: (topic, args, { models }) => {
      return topic.getCoverImage();
    },
  },
};
