export default {
  UwantsSocialPost: {
    platformUrl: (obj) => {
      return `https://www.uwants.com/viewthread.php?tid=${obj.platformId}`;
    },
  },
};
