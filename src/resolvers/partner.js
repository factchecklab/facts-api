export default {
  Query: {
    partners: async (parent, args, {models}) => {
      return await models.Partner.findAll();
    },
    partner: async (parent, { id }, {models}) => {
      return await models.Partner.findByPk(id);
    }
  }
}
