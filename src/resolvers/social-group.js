export default {
  Query: {
    socialGroups: (parent, args, { dataPipelineModels, elastic }) => {
      /* eslint-disable camelcase */
      return [
        {
          platform: { name: 'lihkg' },
          group_id: 1,
          name: '吹水台',
        },
        {
          platform: { name: 'lihkg' },
          group_id: 2,
          name: '時事台',
        },
        {
          platform: { name: 'lihkg' },
          group_id: 3,
          name: '財經台',
        },
        {
          platform: { name: 'lihkg' },
          group_id: 4,
          name: '娛樂台',
        },
        {
          platform: { name: 'lihkg' },
          group_id: 5,
          name: '上班台',
        },
        {
          platform: { name: 'discusshk' },
          group_id: 6,
          name: '香港及世界新聞討論',
        },
      ];
      /* eslint-enable camelcase */
    },
  },
};
