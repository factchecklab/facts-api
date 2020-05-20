import searchQuery from 'search-query-parser';

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

export const reactionDeltaModels = {
  month: 'MonthlyReactionDelta',
  day: 'DailyReactionDelta',
  hour: 'HourlyReactionDelta',
};

export const defaultTimeframe = '1m';

export const esQueryObject = (query, timeframe) => {
  // Given a key and an array, convert it into an elasticsearch query object conjuncted with and's
  const convert = function (key, values, exact = false) {
    const condition = exact ? 'term' : 'match';
    return (values || []).map((value) => {
      return { [condition]: { [key]: value } };
    });
  };

  const parsedQuery = searchQuery.parse(query, {
    keywords: [
      'title',
      'content',
      'platform',
      'group',
      'user',
      'url',
      'post',
      'text',
    ],
    alwaysArray: true,
    tokenize: true,
  });

  const queryObject = { bool: { must: [] } };

  // Sets the time range
  queryObject.bool.must.push({
    // eslint-disable-next-line camelcase
    range: { created_at: { from: timeframe.from } },
  });

  if (parsedQuery.text) {
    const { text } = parsedQuery;
    const condition = (text || []).map((value) => {
      return {
        // eslint-disable-next-line camelcase
        multi_match: {
          query: value,
          fields: ['title', 'content'],
        },
      };
    });

    if (condition.length > 0) {
      queryObject.bool.must.push({ bool: { should: condition } });
    }
  } else {
    // Sets the title condition
    const titleCondition = convert('title', parsedQuery.title);
    if (titleCondition.length > 0) {
      queryObject.bool.must.push({ bool: { should: titleCondition } });
    }

    // Sets the content condition
    const contentCondition = convert('content', parsedQuery.content);
    if (contentCondition.length > 0) {
      queryObject.bool.must.push({ bool: { should: contentCondition } });
    }
  }

  // Sets the group condition
  const groupCondition = (parsedQuery.group || []).map((value) => {
    if (!value.endsWith('_*')) {
      return { term: { 'group.id.keyword': value } };
    }
    const platform = value.replace(/_\*$/, '');
    return { term: { 'group.platform_name.keyword': platform } };
  });
  if (groupCondition.length > 0) {
    queryObject.bool.must.push({ bool: { should: groupCondition } });
  }

  if (parsedQuery.user) {
    const { user } = parsedQuery;
    const userCondition = user.map((value) => {
      return {
        // eslint-disable-next-line camelcase
        multi_match: {
          query: value,
          fields: ['user.id.keyword', 'user.name.keyword'],
        },
      };
    });
    queryObject.bool.must.push({ bool: { should: userCondition } });
  }

  // Sets the URL condition
  const urlCondition = convert('content_urls.keyword', parsedQuery.url, true);
  if (urlCondition.length > 0) {
    queryObject.bool.must.push({ bool: { should: urlCondition } });
  }

  // Sets the post condition
  const postCondition = convert('_id', parsedQuery.post, true);
  if (postCondition.length > 0) {
    queryObject.bool.must.push({ bool: { should: postCondition } });
  }

  return queryObject;
};
