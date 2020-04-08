const indexName = 'reports';

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
  let targetDoc = {
    _index: indexName,
  };
  if (documentId) {
    targetDoc = {
      ...targetDoc,
      _id: documentId,
    };
  } else {
    targetDoc = {
      ...targetDoc,
      doc: { content },
    };
  }
  /* eslint-enable camelcase */

  const { body } = await client.search({
    index: 'reports',
    from: offset,
    size: limit,
    body: {
      query: {
        /* eslint-disable camelcase */
        more_like_this: {
          fields: ['content'],
          like: [targetDoc],
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

const addHooks = ({ Report }, client) => {
  Report.addHook('afterSave', async (report, options) => {
    try {
      await save(client, report, options);
    } catch (error) {
      console.error(
        `Error occurred while indexing Report with ID ${report.id}:`,
        error
      );
    }
  });
  Report.addHook('afterDestroy', async (report, options) => {
    try {
      await remove(client, report, options);
    } catch (error) {
      console.error(
        `Error occurred while removing index for Report with ID ${report.id}:`,
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
  searchSimilarByContent,
};
