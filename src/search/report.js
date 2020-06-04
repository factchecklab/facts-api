const indexName = 'reports';

const MIN_MORE_LIKE_THIS_SCORE = 5;

const save = async (client, report, options) => {
  const {
    id,
    documentId,
    topicId,
    content,
    source,
    url,
    closed,
    createdAt,
    updatedAt,
  } = report;
  await client.index({
    index: indexName,
    id: documentId,
    body: {
      id,
      topicId,
      content,
      source,
      url,
      closed,
      createdAt,
      updatedAt,
      '@timestamp': new Date(),
    },
  });
};

const remove = async (client, { documentId }, options) => {
  await client.delete({
    index: indexName,
    id: documentId,
  });
};

const searchByKeyword = async (client, keyword, closed, offset, limit) => {
  const { body } = await client.search({
    index: indexName,
    from: offset,
    size: limit,
    body: {
      query: {
        bool: {
          filter: {
            term: {
              closed: {
                value: closed,
              },
            },
          },
          must: {
            match: {
              content: keyword,
            },
          },
        },
      },
    },
  });
  return body.hits.hits.map((doc) => doc._id);
};

const searchSimilarByContent = async (
  client,
  documentId,
  content,
  offset,
  limit
) => {
  let query;
  /* eslint-disable camelcase */
  if (documentId) {
    query = {
      more_like_this: {
        fields: ['content'],
        like: {
          _index: indexName,
          _id: documentId,
        },
        min_term_freq: 1,
        max_query_terms: 12,
        min_doc_freq: 1,
        analyzer: 'cantonese_search',
      },
    };
  } else {
    query = {
      bool: {
        should: [
          {
            more_like_this: {
              fields: ['content'],
              like: content,
              min_term_freq: 1,
              max_query_terms: 12,
              min_doc_freq: 1,
              analyzer: 'cantonese_search',
            },
          },
          {
            terms: {
              'url.keyword': [content],
              // Normally it returns 1 if matched.
              // Returns MIN_MORE_LIKE_THIS_SCORE so that it is not filter away.
              boost: MIN_MORE_LIKE_THIS_SCORE,
            },
          },
        ],
      },
    };
  }
  /* eslint-enable camelcase */

  const { body } = await client.search({
    index: 'reports',
    from: offset,
    size: limit,
    body: { query },
  });

  return body.hits.hits
    .filter((doc) => doc._score >= MIN_MORE_LIKE_THIS_SCORE)
    .map((doc) => doc._id);
};

export default {
  save,
  remove,
  searchByKeyword,
  searchSimilarByContent,
};
