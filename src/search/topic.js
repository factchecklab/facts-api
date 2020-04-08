const indexName = 'topics';

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
      message: {
        content: message.content,
      },
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
  Topic.addHook('afterSave', async (topic, options) => {
    try {
      await save(client, topic, options);
    } catch (error) {
      console.error(
        `Error occurred while indexing Topic with ID ${topic.id}:`,
        error
      );
    }
  });
  Topic.addHook('afterDestroy', async (topic, options) => {
    try {
      await remove(client, topic, ooptions);
    } catch (error) {
      console.error(
        `Error occurred while removing index for Topic with ID ${topic.id}:`,
        error
      );
    }
  });
};

export default {
  save,
  remove,
  addHooks,
  searchByKeyword,
  searchSimilarByMessageContent,
};
