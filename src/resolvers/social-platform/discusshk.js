export default {
  DiscussHKSocialPost: {
    platformUrl: (obj) => {
      return `https://www.discuss.com.hk/viewthread.php?tid=${obj.platformId}`;
    },
  },
};
