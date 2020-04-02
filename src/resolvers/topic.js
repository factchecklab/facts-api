export default {
  Query: {
    topics: async (parent, args, {models}) => {
      return await models.Topic.findAll();
    },
  },

  Topic: {
    originalReport: async (topic, args, { models }) => {
      return await topic.getOriginalReport();
    },
    responses: async(topic, args, { models }) => {
      return await topic.getResponses();
    }
  }
}

