import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const generateAssetUrl = async (asset, { storage }) => {
  const bucket = storage.bucket(process.env.ASSETS_STORAGE_BUCKET);
  const file = bucket.file(asset.path);

  // Generate a presigned URL with an expiry of 2 hours, starting from the
  // beginning of the current hour.
  // This generates a presigned URL that doesn't change for at most 1 hour.
  const hourInMilliseconds = 60 * 60 * 1000;
  const expires =
    Math.floor(new Date().getTime() / hourInMilliseconds + 2) *
    hourInMilliseconds;
  const result = await file.getSignedUrl({
    action: 'read',
    expires,
  });
  return result.length > 0 ? result[0] : 1;
};

export const uploadAndBuildAsset = async (file, { models, storage }) => {
  const { filename, mimetype, createReadStream } = await file;

  const bucket = storage.bucket(process.env.ASSETS_STORAGE_BUCKET);
  const filepath = path.posix.join(
    process.env.ASSETS_STORAGE_PREFIX,
    `${uuidv4()}.${mime.extension(mimetype)}`
  );
  const gcsfile = bucket.file(filepath);

  const stream = gcsfile.createWriteStream({
    contentType: mimetype,
  });

  await new Promise((resolve, reject) => {
    createReadStream()
      .pipe(stream)
      .on('error', (err) => {
        reject(err);
      })
      .on('finish', () => {
        resolve();
      });
  });
  return models.Asset.build({
    contentType: mimetype,
    path: filepath,
    filename: filename,
  });
};

export default {
  Mutation: {
    uploadAsset: async (parent, { file }, context) => {
      const asset = await uploadAndBuildAsset(file, context);
      return asset.save({ returning: true });
    },
  },

  Asset: {
    url: (asset, args, context) => {
      return generateAssetUrl(asset, context);
    },
  },
};
