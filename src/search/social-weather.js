export const timeframes = {
  '1y': {
    from: 'now-1y',
    interval: '1M',
  },
  '3m': {
    from: 'now-90d',
    interval: '1d',
  },
  '1m': {
    from: 'now-30d',
    interval: '1d',
  },
  '1w': {
    from: 'now-1w',
    interval: '1h',
  },
  '1d': {
    from: 'now-1d',
    interval: '1h',
  },
};

export const defaultTimeframe = '1m';
