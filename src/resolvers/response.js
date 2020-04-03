export default {
  Response: {
    entity: (response, args, { models }) => {
      return response.getEntity();
    },
    attachments: (response, args, { models }) => {
      return responses.getAttachments();
    },
  },
};
