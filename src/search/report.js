const INDEX_NAME = 'facts-reports';
const MIN_MORE_LIKE_THIS_SCORE = 5;

const documentId = (id) => {
  return `report_${id}`;
};

export const save = async (client, report, opts) => {
  // Create a new object with some keys removed from dataValues.
  /* eslint-disable no-unused-vars */
  const { id, deletedAt, publisherId, ...rest } = report.dataValues;
  /* eslint-enable no-unused-vars */

  const publisher = await report.getPublisher(opts);
  const tags = await report.getReportTags(opts);

  const body = {
    ...rest,
    id,
    publisher: {
      id: publisher.id,
      name: publisher.name,
    },
    tags: tags.map((t) => t.name),
    '@timestamp': new Date(),
  };
  await client.index({
    index: INDEX_NAME,
    id: documentId(id),
    body,
  });
};

export const remove = async (client, { id }, opts) => {
  await client.delete({
    index: INDEX_NAME,
    id: documentId(id),
  });
};

export const searchByKeyword = async (
  client,
  keyword,
  closed,
  offset,
  limit
) => {
  const { body } = await client.search({
    index: INDEX_NAME,
    from: offset,
    size: limit,
    body: {
      query: {
        bool: {
          must: {
            // eslint-disable-next-line camelcase
            multi_match: {
              query: keyword,
              fields: ['summary', 'explanation'],
            },
          },
        },
      },
    },
  });
  return body.hits.hits.map((doc) => doc.id);
};

export const searchSimilarByContent = async (
  client,
  message,
  url,
  offset,
  limit
) => {
  const shouldClauses = [];

  if (message) {
    shouldClauses.push({
      /* eslint-disable camelcase */
      more_like_this: {
        fields: ['originalMessage'],
        like: message,
        min_term_freq: 1,
        max_query_terms: 12,
        min_doc_freq: 1,
        analyzer: 'cantonese_search',
      },
      /* eslint-enable camelcase */
    });
  }

  if (url) {
    shouldClauses.push({
      terms: {
        'originalUrls.keyword': [url],
        // Normally it returns 1 if matched.
        // Returns MIN_MORE_LIKE_THIS_SCORE so that it is not filter away.
        boost: MIN_MORE_LIKE_THIS_SCORE,
      },
    });
  }

  const query = {
    bool: {
      should: shouldClauses,
    },
  };

  const { body } = await client.search({
    index: INDEX_NAME,
    from: offset,
    size: limit,
    body: { query },
  });

  return body.hits.hits.filter((doc) => doc._score >= MIN_MORE_LIKE_THIS_SCORE);
};

export default {
  save,
  remove,
  searchByKeyword,
  searchSimilarByContent,
};
