import gql from 'graphql-tag';

export default gql`
  extend type Query {
    topics(
      keyword: String
      closed: Boolean = false
      offset: Int = 0
      limit: Int = 20
    ): [Topic!]!
    topic(id: ID!): Topic
    similarTopics(content: String, url: String, reportId: ID): [Topic!]!
  }

  type Topic {
    id: ID!
    title: String!
    summary: String
    published: Boolean!
    conclusion: Conclusion!
    message: Message!
    responses: [Response!]!
    reports: [Report!]!
    createdAt: Date!
    updatedAt: Date!
  }
`;
