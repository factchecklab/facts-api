export default {
  Query: {
    socialPostTrend: async () => {
      // TODO (samueltangz): support more arguments apart from `keyword`
      // TODO (samueltangz): remove this random delay and unstub the data
      await new Promise((resolve, _) => {
        setTimeout(resolve, 500);
      });
      return [
        {
          time: new Date('2020-03-01T00:00:00Z'),
          value: Math.floor(Math.random() * 1000),
        },
        {
          time: new Date('2020-03-04T00:00:00Z'),
          value: Math.floor(Math.random() * 1000),
        },
        {
          time: new Date('2020-03-07T00:00:00Z'),
          value: Math.floor(Math.random() * 1000),
        },
        {
          time: new Date('2020-03-10T00:00:00Z'),
          value: Math.floor(Math.random() * 1000),
        },
        {
          time: new Date('2020-03-13T00:00:00Z'),
          value: Math.floor(Math.random() * 1000),
        },
      ];
    },
  },
};
