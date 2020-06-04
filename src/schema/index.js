import gql from 'graphql-tag';

import directives from './directives';
import pagination from './pagination';
import entity from './entity';
import topic from './topic';
import response from './response';
import attachment from './attachment';
import asset from './asset';
import message from './message';
import report from './report';
import socialPlatform from './social-platform';
import socialGroup from './social-group';
import socialUser from './social-user';
import socialPost from './social-post';
import socialPostLinks from './social-post-links';
import socialPostKeywords from './social-post-keywords';
import socialPostTrend from './social-post-trend';
import socialInteractionTrend from './social-interaction-trend';
import lihkg from './social-platform/lihkg';
import discusshk from './social-platform/discusshk';
import uwants from './social-platform/uwants';
import generic from './social-platform/generic';

const link = gql`
  scalar Date
  scalar AssetToken
  scalar URL

  enum Conclusion {
    truthy
    falsy
    uncertain
    disputed
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  #type Subscription {
  #  _: Boolean
  #}
`;

export default [
  link,
  directives,
  pagination,
  entity,
  topic,
  response,
  attachment,
  asset,
  message,
  report,
  socialPlatform,
  socialGroup,
  socialUser,
  socialPost,
  socialPostLinks,
  socialPostKeywords,
  socialPostTrend,
  socialInteractionTrend,
  lihkg,
  discusshk,
  uwants,
  generic,
];
