const indexName = 'topics';

const MIN_MORE_LIKE_THIS_SCORE = 5;

const save = async (client, topic, options) => {
  const {
    id,
    documentId,
    title,
    published,
    conclusion,
    createdAt,
    updatedAt,
  } = topic;

  const message = await topic.getMessage(options);
  const responses = await topic.getResponses(options);
  await client.index({
    index: indexName,
    id: documentId,
    body: {
      id,
      title,
      published,
      conclusion,
      message: message
        ? {
            content: message.content,
          }
        : null,
      responses: responses.map((response) => {
        const { type, content, published, conclusion } = response;
        return { type, content, published, conclusion };
      }),
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

const searchByKeyword = async (client, keyword, offset, limit) => {
  const { body } = await client.search({
    index: indexName,
    from: offset,
    size: limit,
    body: {
      query: {
        bool: {
          filter: {
            term: {
              published: {
                value: true,
              },
            },
          },
          must: {
            /* eslint-disable-next-line camelcase */
            multi_match: {
              query: keyword,
              fields: ['title', 'message.content', 'responses.content'],
            },
          },
        },
      },
    },
  });
  return body.hits.hits.map((doc) => doc._id);
};

const searchSimilarByMessageContent = async (
  client,
  content,
  offset,
  limit
) => {
  const { body } = await client.search({
    index: indexName,
    from: offset,
    size: limit,
    body: {
      query: {
        /* eslint-disable camelcase */
        bool: {
          should: [
            {
              more_like_this: {
                fields: ['message.content'],
                like: content,
                min_term_freq: 1,
                max_query_terms: 12,
                min_doc_freq: 1,
                analyzer: 'cantonese_search',
              },
            },
            {
              terms: {
                'message.url.keyword': [content],
                // Normally it returns 1 if matched.
                // Returns MIN_MORE_LIKE_THIS_SCORE so that it is not filter away.
                boost: MIN_MORE_LIKE_THIS_SCORE,
              },
            },
          ],
        },
        /* eslint-enable camelcase */
      },
    },
  });
  return body.hits.hits
    .filter((doc) => doc._score >= MIN_MORE_LIKE_THIS_SCORE)
    .map((doc) => doc._id);
};

export default {
  save,
  remove,
  searchByKeyword,
  searchSimilarByMessageContent,
};
