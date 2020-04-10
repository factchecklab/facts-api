import jwt from 'jsonwebtoken';

const jwtOptions = { algorithm: 'HS256' };

const getTokenSecret = () => {
  const secret =
    process.env.APPLICATION_SECRET ||
    (process.env.NODE_ENV === 'development' && 'secret');
  if (!secret) {
    throw new Error(
      'Unable to verify asset token because of a configuration error.'
    );
  }
};

export class AssetTokenError extends Error {
  constructor(message) {
    super(message || 'Incorrect asset token or not specified.');
  }
}

export const generate = (assetId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { assetId: parseInt(assetId) },
      process.env.APPLICATION_SECRET,
      jwtOptions,
      (err, token) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(token);
      }
    );
  });
};

export const verify = (token, expectedAssetId) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      throw new AssetTokenError();
      return;
    }

    jwt.verify(
      token,
      process.env.APPLICATION_SECRET,
      jwtOptions,
      (err, payload) => {
        if (err) {
          reject(err);
          return;
        }

        if (expectedAssetId && parseInt(expectedAssetId) !== payload.assetId) {
          reject(new AssetTokenError());
          return;
        }

        resolve(payload.assetId);
      }
    );
  });
};
