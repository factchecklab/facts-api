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

  extend type Mutation {
    createTopic(input: CreateTopicInput!): CreateTopicPayload!
    updateTopic(input: UpdateTopicInput!): UpdateTopicPayload!
    deleteTopic(input: DeleteTopicInput!): DeleteTopicPayload!
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

  input TopicMessageInput {
    content: String
  }

  input CreateTopicInput {
    reportId: ID
    title: String
    summary: String
    published: Boolean! = false
    conclusion: Conclusion! = uncertain
    message: TopicMessageInput
  }

  type CreateTopicPayload {
    topic: Topic!
  }

  input UpdateTopicInput {
    id: ID!
    title: String
    summary: String
    published: Boolean
    conclusion: Conclusion
    message: TopicMessageInput
  }

  type UpdateTopicPayload {
    topic: Topic!
  }

  input DeleteTopicInput {
    id: ID!
  }

  type DeleteTopicPayload {
    topicId: ID!
  }
`;
