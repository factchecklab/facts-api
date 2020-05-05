export default {
  SocialUser: {
    __resolveType: (user) => {
      if (!user.platform) {
        console.log('Expecting social user platform to be non-null. Got null.');
        return null;
      }

      console.log(user);
      switch (user.platform.name) {
        case 'lihkg':
          return 'LIHKGSocialUser';
        case 'discusshk':
          return 'DiscussHKSocialUser';
        case 'uwants':
          return 'UwantsSocialUser';
      }
      console.log(`Unxpected user social platform '${user.platform.name}'`);
      return null;
    },
  },
};
