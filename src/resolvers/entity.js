export default {
  Query: {
    entities: (parent, args, { models }) => {
      return models.Entity.findAll();
    },
    entity: (parent, { id }, { models }) => {
      return models.Entity.findByPk(id);
    },
  },
};
