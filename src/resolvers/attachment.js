export default {
  Attachment: {
    asset: async (attachment, args, { models }) => {
      return await attachment.getAsset();
    }
  }
}


