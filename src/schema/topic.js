import gql from 'graphql-tag';

export default gql`
  extend type Query {
    topics(
      keyword: String
      includeUnpublished: Boolean = false
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

    """
    Cover image for the topic.
    """
    coverImage: Asset
    responses(includeUnpublished: Boolean = false): [Response!]!
    reports: [Report!]!
    createdAt: Date!
    updatedAt: Date!
  }

  input TopicMessageInput {
    content: String
  }

  """
  Input for a response in CreateTopic.
  """
  input CreateTopicResponseInput {
    """
    Content of the response.
    """
    content: String

    """
    Type of the response.
    """
    type: ResponseType

    """
    Published state of the response.
    """
    published: Boolean

    """
    Conclusion of the response.
    """
    conclusion: Conclusion

    """
    ID of the entity of the response.
    """
    entityId: ID!
  }

  input CreateTopicInput {
    reportId: ID
    title: String
    summary: String
    published: Boolean! = false
    conclusion: Conclusion! = uncertain
    message: TopicMessageInput

    """
    A list of responses to be created.
    """
    responses: [CreateTopicResponseInput!]!

    """
    ID of the asset for the cover image.
    """
    coverImageAssetId: ID
  }

  type CreateTopicPayload {
    topic: Topic!
  }

  """
  Input for a response in UpdateTopic.
  """
  input UpdateTopicResponseInput {
    """
    ID of the response to be modified. If no ID is specified, a new response
    will be created.
    """
    id: ID

    """
    Content of the response.
    """
    content: String

    """
    Type of the response.
    """
    type: ResponseType

    """
    Published state of the response.
    """
    published: Boolean

    """
    Conclusion of the response.
    """
    conclusion: Conclusion

    """
    ID of the entity of the response.
    """
    entityId: ID
  }

  input UpdateTopicInput {
    id: ID!
    title: String
    summary: String
    published: Boolean
    conclusion: Conclusion
    message: TopicMessageInput

    """
    A list of responses to be saved. Any existing response not included
    in this list will be removed from this topic.
    """
    responses: [UpdateTopicResponseInput!]

    """
    ID of the asset for the cover image.
    """
    coverImageAssetId: ID
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
