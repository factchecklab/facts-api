export default {
  SocialUser: {
    __resolveType: (user, { logger }) => {
      if (!user.platform) {
        logger.warn('Expecting social user platform to be non-null. Got null.');
        return null;
      }

      switch (user.platform.name) {
        case 'lihkg':
          return 'LIHKGSocialUser';
        case 'discusshk':
          return 'DiscussHKSocialUser';
        case 'uwants':
          return 'UwantsSocialUser';
        default:
          logger.warn(`Unxpected user social platform '${user.platform.name}'`);
          return 'GenericSocialUser';
      }
    },
  },
};
