export default {
  Query: {
    reports: async (parent, args, { models }) => {
      return await models.Report.findAll();
    },
    report: async (parent, { id }, { models }) => {
      return await models.Report.findByPk(id);
    }
  }
}

