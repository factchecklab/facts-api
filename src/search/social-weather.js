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

  // Sets the time range
  const filterClause = {
    // eslint-disable-next-line camelcase
    range: { created_at: { from: timeframe.from } },
  };
  const mustClauses = buildBooleanClauses(parsedQuery);
  const mustNotClauses = buildBooleanClauses(parsedQuery.exclude);

  // Update query object
  const boolQuery = {};
  boolQuery.filter = filterClause;
  if (mustClauses.length) {
    boolQuery.must = mustClauses;
  }
  if (mustNotClauses.length) {
    // eslint-disable-next-line camelcase
    boolQuery.must_not = mustNotClauses;
  }

  return {
    bool: boolQuery,
  };
};

/**
 * Return query clauses for elasticsearch boolean query.
 *
 * Returns an array of clauses for specifying a boolean query 'occurrence'
 * such as 'must', 'must_not'.
 *
 */
export const buildBooleanClauses = (conditions) => {
  let { text } = conditions;
  const { title, content, group, user, url, post, platform } = conditions;
  const clauses = [];

  /**
   * This section handles text, title, and content, which use 'match' to
   * search for textual data.
   */

  // Sets the title condition
  if (text) {
    // for some reason `alwaysArray` does not take effect in exclude list, hence
    // wrapping the text value as array if it is not an array.
    if (!Array.isArray(text)) {
      text = [text];
    }
    if (text.length > 0) {
      const subClauses = text.map((value) => {
        return {
          // eslint-disable-next-line camelcase
          multi_match: {
            query: value,
            fields: ['text', 'content'],
          },
        };
      });
      clauses.push(
        subClauses.length === 1
          ? subClauses[0]
          : { bool: { should: subClauses } }
      );
    }
  }

  // Sets the title condition
  if (title && title.length > 0) {
    const subClauses = title.map((value) => {
      return { match: { title: value } };
    });
    clauses.push(
      subClauses.length === 1 ? subClauses[0] : { bool: { should: subClauses } }
    );
  }

  // Sets the content condition
  if (content && content.length > 0) {
    const subClauses = content.map((value) => {
      return { match: { content: value } };
    });
    clauses.push(
      subClauses.length === 1 ? subClauses[0] : { bool: { should: subClauses } }
    );
  }

  /**
   * This section handles other fields that match by 'term' (exact match).
   */

  // Sets the group condition
  if (group && group.length > 0) {
    const platformList = group
      .filter((value) => {
        return value.endsWith('_*');
      })
      .map((value) => {
        return value.replace(/_\*$/, '');
      });
    const groupList = group.filter((value) => {
      return !value.endsWith('_*');
    });

    const subClauses = [];
    if (platformList.length > 0) {
      subClauses.push({
        terms: { 'group.platform_name.keyword': platformList },
      });
    }
    if (groupList.length > 0) {
      subClauses.push({
        terms: { 'group.id.keyword': groupList },
      });
    }

    clauses.push(
      subClauses.length === 1 ? subClauses[0] : { bool: { should: subClauses } }
    );
  }

  // Sets the group condition
  if (user && user.length > 0) {
    clauses.push({
      bool: {
        should: [
          { terms: { 'user.id.keyword': user } },
          { terms: { 'user.name.keyword': user } },
        ],
      },
    });
  }

  // Sets the URL condition
  if (url && url.length > 0) {
    clauses.push({ terms: { 'content_urls.keyword': url } });
  }

  // Sets the post condition
  if (post && post.length > 0) {
    clauses.push({ terms: { _id: post } });
  }

  // Sets the platform condition
  if (platform && platform.length > 0) {
    clauses.push({ terms: { 'platform_name.keyword': platform } });
  }

  return clauses;
};
