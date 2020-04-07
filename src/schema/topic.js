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

    """
    Search for topics that are similar to the specified values.
    """
    similarTopics(
      """
      Report ID which data will be used for similarity search. If specified,
      the other parameters will be ignored.
      """
      reportId: ID

      """
      The message content.
      """
      content: String
    ): [Topic!]!
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
