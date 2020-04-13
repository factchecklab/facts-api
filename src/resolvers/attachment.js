import { generateAssetUrl, uploadAndBuildAsset } from './asset';
import { NotFound } from './errors';
import {
  verify as verifyAssetToken,
  AssetTokenError,
} from '../util/asset-token';

const ensureItem = async (itemType, itemId, { models }) => {
  const modelName = Object.keys(models).find((key) => {
    return models[key].name === itemType;
  });
  const item = await models[modelName].findByPk(itemId);
  if (!item) {
    throw new NotFound(
      `Could not find a '${itemType}' with the id '${itemId}'`
    );
  }
};

export default {
  Mutation: {
    createAttachment: async (parent, { input }, context) => {
      const { itemType, itemId, type, location, assetToken } = input;
      const { sequelize, models } = context;
      await ensureItem(itemType, itemId, context);
      let attachment;
      if (type === 'url') {
        attachment = models.Attachment.build({
          itemType,
          itemId,
          type,
          location,
        });
      } else if (type === 'asset') {
        try {
          attachment = models.Attachment.build({
            itemType,
            itemId,
            type,
            assetId: await verifyAssetToken(assetToken),
          });
        } catch (error) {
          if (error instanceof AssetTokenError) {
            throw new ValidationError(error.toString());
          }
          throw error;
        }
      } else {
        throw new Error(`Unexpected attachment type ${type}.`);
      }

      return sequelize.transaction(async (t) => {
        return {
          attachment: await attachment.save({
            transaction: t,
            returning: true,
          }),
        };
      });
    },

    deleteAttachment: async (parent, { input }, { models }) => {
      const { id } = input;
      const attachment = await models.Attachment.findByPk(id);
      if (!attachment) {
        throw new NotFound(`Could not find an attachment with the id '${id}'`);
      }

      await attachment.destroy();
      return {
        attachmentId: id,
      };
    },
  },

  Attachment: {
    asset: (attachment, args, { models }) => {
      return attachment.getAsset();
    },
  },
};
