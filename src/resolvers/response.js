export default {
  Response: {
    partner: async (response, args, { models }) => {
      return await response.getPartner();
    },
    attachments: async (response, args, { models }) => {
      return await responses.getAttachments();
    }
  }

}

