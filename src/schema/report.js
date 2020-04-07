import gql from 'graphql-tag';

export default gql`
  extend type Query {
    reports(
      keyword: String
      closed: Boolean = false
      offset: Int = 0
      limit: Int = 20
    ): [Report!]!
    report(id: ID!): Report

    """
    Search for reports that are similar to the specified values.
    """
    similarReports(
      """
      Report ID which data will be used for similarity search. If specified,
      the other parameters will be ignored.
      """
      reportId: ID

      """
      The report content.
      """
      content: String

      """
      Paging offset.
      """
      offset: Int = 0

      """
      Paging limit.
      """
      limit: Int = 20
    ): [Report!]!
  }

  extend type Mutation {
    createReport(input: CreateReportInput!): CreateReportPayload!
    closeReports(input: CloseReportsInput!): CloseReportsPayload!
    reopenReports(input: ReopenReportsInput!): ReopenReportsPayload!

    """
    Matched topic with the specified reports.
    """
    addReportsToTopic(input: AddReportsToTopicInput!): AddReportsToTopicPayload!

    """
    Remove the matched topic from the specified reports.
    """
    removeReportsFromTopic(
      input: RemoveReportsFromTopicInput!
    ): RemoveReportsFromTopicPayload!
  }

  type Report {
    id: ID!
    content: String!
    source: String
    url: String
    closed: Boolean!
    attachments: [Attachment!]!
    topic: Topic
    createdAt: Date!
    updatedAt: Date!

    """
    Returns topics that have similar message content for this report.
    """
    similarTopics: [Topic!]!
  }

  input CreateReportInput {
    content: String!
    source: String!
    url: String
  }

  type CreateReportPayload {
    report: Report!
  }

  input CloseReportsInput {
    reportIds: [ID!]!
  }

  type CloseReportsPayload {
    _: Boolean
  }

  input ReopenReportsInput {
    reportIds: [ID!]!
  }

  type ReopenReportsPayload {
    _: Boolean
  }

  input AddReportsToTopicInput {
    reportIds: [ID!]!
    topicId: ID!
  }

  type AddReportsToTopicPayload {
    _: Boolean
  }

  input RemoveReportsFromTopicInput {
    reportIds: [ID!]!
  }

  type RemoveReportsFromTopicPayload {
    _: Boolean
  }
`;
