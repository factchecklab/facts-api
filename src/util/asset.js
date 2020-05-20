import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const generateAssetUrl = async (storage, asset, options) => {
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
    ...(options || {}),
  });
  return result.length > 0 ? result[0] : 1;
};

export const uploadAssetFromStream = async (
  storage,
  stream,
  { filename, contentType }
) => {
  const bucket = storage.bucket(process.env.ASSETS_STORAGE_BUCKET);
  const filepath = path.posix.join(
    process.env.ASSETS_STORAGE_PREFIX,
    `${uuidv4()}.${mime.extension(contentType)}`
  );
  const gcsfile = bucket.file(filepath);

  const writeStream = gcsfile.createWriteStream({
    contentType,
  });

  await new Promise((resolve, reject) => {
    stream
      .pipe(writeStream)
      .on('error', (err) => {
        reject(err);
      })
      .on('finish', () => {
        resolve();
      });
  });
  return {
    contentType,
    filename,
    path: filepath,
  };
};

export const uploadAsset = async (storage, file) => {
  const { filename, mimetype, createReadStream } = await file;
  return uploadAssetFromStream(storage, createReadStream(), {
    filename,
    contentType: mimetype,
  });
};

export { generate as generateAssetToken } from './asset-token';
