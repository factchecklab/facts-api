// `from` and `interval` are used by elasticsearch, while
// `unit` is used by postgres

export const timeframes = {
  '1y': {
    from: 'now-1y',
    interval: '1M',
    unit: 'month',
  },
  '3m': {
    from: 'now-90d',
    interval: '1d',
    unit: 'day',
  },
  '1m': {
    from: 'now-30d',
    interval: '1d',
    unit: 'day',
  },
  '1w': {
    from: 'now-1w',
    interval: '1h',
    unit: 'hour',
  },
  '1d': {
    from: 'now-1d',
    interval: '1h',
    unit: 'hour',
  },
};

export const defaultTimeframe = '1m';
