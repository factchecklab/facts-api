const indexName = 'topics';

const save = async (client, topic) => {
  const {
    id,
    documentId,
    title,
    published,
    conclusion,
    createdAt,
    updatedAt,
  } = topic;

  const message = await topic.getMessage();
  const responses = await topic.getResponses();
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

const remove = async (client, { documentId }) => {
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
        more_like_this: {
          fields: ['message.content'],
          like: [
            {
              _index: indexName,
              doc: {
                message: { content },
              },
            },
          ],
          min_term_freq: 1,
          max_query_terms: 12,
          min_doc_freq: 1,
        },
        /* eslint-enable camelcase */
      },
    },
  });
  return body.hits.hits.map((doc) => doc._id);
};

const addHooks = ({ Topic }, client) => {
  Topic.addHook('afterCreate', async (topic, options) => {
    await save(client, topic);
  });
  Topic.addHook('afterUpdate', async (topic, options) => {
    await save(client, topic);
  });
  Topic.addHook('afterDestroy', async (topic, options) => {
    await remove(client, topic);
  });
};

export default {
  save,
  remove,
  addHooks,
  searchByKeyword,
  searchSimilarByMessageContent,
};
