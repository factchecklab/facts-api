import {
  generateAssetUrl,
  generateAssetToken,
  uploadAsset,
} from '../util/asset';

export const uploadAndBuildAsset = async (file, { models, storage }) => {
  return models.Asset.build(await uploadAsset(storage, file));
};

export default {
  Mutation: {
    uploadAsset: async (parent, { file }, context) => {
      const asset = await uploadAndBuildAsset(file, context);
      return asset.save({ returning: true });
    },
  },

  Asset: {
    url: (asset, args, { storage }) => {
      return generateAssetUrl(storage, asset, {});
    },
    downloadUrl: (asset, args, { storage }) => {
      return generateAssetUrl(storage, asset, { promptSaveAs: asset.filename });
    },
  },

  UploadedAsset: {
    url: (asset, args, { storage }) => {
      return generateAssetUrl(storage, asset, {});
    },
    downloadUrl: (asset, args, { storage }) => {
      return generateAssetUrl(storage, asset, { promptSaveAs: asset.filename });
    },
    token: (asset, args, context) => {
      return generateAssetToken(asset.id);
    },
  },
};
