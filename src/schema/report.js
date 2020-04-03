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
  }

  extend type Mutation {
    createReport(input: CreateReportInput!): CreateReportPayload!
    closeReports(input: CloseReportsInput!): CloseReportsPayload!
    reopenReports(input: ReopenReportsInput!): ReopenReportsPayload!
    addReportsToTopic(input: AddReportsToTopicInput!): AddReportsToTopicPayload!
  }

  type Report {
    id: ID!
    content: String!
    source: String
    url: String
    closed: Boolean!
    attachments: [Attachment!]!
    topic: Topic
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
`;
