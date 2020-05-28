import {
  parse,
  terms,
  multimatch,
  match,
  prefixterms,
  range,
} from '../util/search-query-parser';

// `from` and `interval` are used by elasticsearch, while
// `unit` is used by postgres

export const timeframes = {
  '1y': {
    id: '1y',
    from: 'now-1y',
    interval: '1M',
    unit: 'month',
  },
  '3m': {
    id: '3m',
    from: 'now-90d',
    interval: '1d',
    unit: 'day',
  },
  '1m': {
    id: '1m',
    from: 'now-30d',
    interval: '1d',
    unit: 'day',
  },
  '1w': {
    id: '1w',
    from: 'now-1w',
    interval: '1h',
    unit: 'hour',
  },
  '1d': {
    id: '1d',
    from: 'now-1d',
    interval: '1h',
    unit: 'hour',
  },
};

export const reactionDeltaModels = {
  month: 'MonthlyReactionDelta',
  day: 'DailyReactionDelta',
  hour: 'HourlyReactionDelta',
};

export const defaultTimeframe = '1m';

const builder = {
  text: (values) => multimatch(['title', 'content'], values),
  title: (values) => match('title', values),
  content: (values) => match('conent', values),
  group: (values) => terms('group.name.keyword', values),
  groupid: (values) =>
    prefixterms('group.id.keyword', 'group.platform_name.keyword', values),
  user: (values) => terms('user.name.keyword', values),
  userid: (values) =>
    prefixterms('user.id.keyword', 'user.platform_name.keyword', values),
  url: (values) => terms('content_urls.keyword', values),
  postid: (values) => prefixterms('_id', 'platform_name.keyword', values),
  platform: (values) => terms('platform_name.keyword', values),
  interactions: (values) => range('interaction_count', values),
  replies: (values) => range('reply_count', values),
  likes: (values) => range('like_count', values),
  dislikes: (values) => range('dislike_count', values),
};

export const esQueryObject = (query, timeframe) => {
  const boolQuery = parse(query, builder);

  // Sets the time range
  const filterClause = {
    // eslint-disable-next-line camelcase
    range: { created_at: { from: timeframe.from } },
  };

  // Update query object
  boolQuery.filter = filterClause;
  return { bool: boolQuery };
};
