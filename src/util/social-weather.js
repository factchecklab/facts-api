const moment = require('moment');

const tickCount = (timeframe) => {
  switch (timeframe.id) {
    case '1y':
      return 12;
    case '3m':
      return 90;
    case '1m':
      return 30;
    case '1w':
      return 168;
    case '1d':
      return 24;
    default:
      throw new Error('undefined timeframe');
  }
};

const currentTick = (timeframe) => {
  const timestamp = moment();

  const year = timestamp.year();
  const month = timestamp.month();
  const day = timestamp.date();
  const hour = timestamp.hour();

  switch (timeframe.id) {
    case '1y':
      return moment.tz([year, month], 'Asia/Hong_Kong').utc();
    case '3m':
    case '1m':
      return moment.tz([year, month, day], 'Asia/Hong_Kong').utc();
    case '1w':
    case '1d':
      return moment.tz([year, month, day, hour], 'Asia/Hong_Kong').utc();
    default:
      throw new Error('undefined timeframe');
  }
};

const buildBuckets = (timeframe) => {
  const latestBucket = currentTick(timeframe);
  let buckets = [];
  for (let i = -tickCount(timeframe); i <= 0; i++) {
    buckets.push(moment(latestBucket).add(i, timeframe.unit).format());
  }
  return buckets;
};

export const padBuckets = (bucketsWithValue, timeframe) => {
  const buckets = buildBuckets(timeframe);
  return buckets.map((bucket) => {
    const valuedBucket = bucketsWithValue.find((valuedBucket) =>
      moment(valuedBucket.time).isSame(bucket, 'hour')
    );
    if (valuedBucket) {
      return { time: bucket, value: valuedBucket.value };
    } else {
      return { time: bucket, value: null };
    }
  });
};
