import gql from 'graphql-tag';

export default gql`
  extend type Query {
    """
    List of fact check reports.
    """
    reports(after: Cursor, before: Cursor, first: Int): ReportConnection!

    """
    A piece of fact check report.
    """
    report(
      """
      ID of the report.
      """
      id: ID!
    ): Report

    searchRelatedReports(content: String): SearchRelatedReportConnection!
  }

  extend type Mutation {
    """
    Create a new fact check report.
    """
    createReport(input: CreateReportInput!): CreateReportPayload!

    """
    Update an existing fact check report.
    """
    updateReport(input: UpdateReportInput!): UpdateReportPayload!

    """
    Delete an existing fact check report.
    """
    deleteReport(input: DeleteReportInput!): DeleteReportPayload!
  }

  """
  Fact check report connection.
  """
  type ReportConnection {
    """
    A list of edges.
    """
    edges: [ReportEdge!]

    """
    A list of nodes.
    """
    nodes: [Report!]

    """
    Pagination info.
    """
    pageInfo: PageInfo!

    """
    Total number of nodes.
    """
    totalCount: Int!
  }

  """
  Fact check report edge.
  """
  type ReportEdge {
    """
    Cursor for pagination.
    """
    cursor: String!

    """
    The node of this edge.
    """
    node: Report
  }

  """
  Search related report connection.
  """
  type SearchRelatedReportConnection {
    """
    A list of edges.
    """
    edges: [SearchRelatedReportEdge!]

    """
    A list of nodes.
    """
    nodes: [Report!]

    """
    Pagination info.
    """
    pageInfo: PageInfo!

    """
    Total number of nodes.
    """
    totalCount: Int!
  }

  """
  Search related report edge.
  """
  type SearchRelatedReportEdge {
    """
    Cursor for pagination.
    """
    cursor: String!

    """
    The score for how good this node matches the search.
    """
    score: Float

    """
    The node of this edge.
    """
    node: Report
  }

  """
  Represents a piece of fact check report.
  """
  type Report {
    """
    The ID of the report.
    """
    id: ID!

    """
    One line summary for describing the fact checked information.
    """
    summary: String!

    """
    The conclusion of fact checking for this information.
    """
    conclusion: Conclusion!

    """
    Further explanation for the fact check conclusion.
    """
    explanation: String!

    """
    The person or entity who authored the report.
    """
    author: String

    """
    The publisher of the fact check report.
    """
    publisher: Publisher!

    """
    The URL of the full report where the public can get more infomation
    about this fact check report.
    """
    fullReportUrl: URL

    """
    The time when this fact check report is published.
    """
    publishedAt: Date!

    """
    The last updated time of this fact check report.
    """
    updatedAt: Date

    """
    The tags of this fact check report.
    """
    tags: [String!]!

    """
    Original message that was fact checked by the publisher.

    The original message is only available to the publisher who published
    this fact check report.
    """
    originalMessage: String

    """
    Original URLs that were fact checked by the publisher.

    The original URLs are only available to the publisher who published
    this fact check report.
    """
    originalUrls: [URL!]
  }

  """
  The input for create report.
  """
  input CreateReportInput {
    """
    One line summary for describing the fact checked information.
    """
    summary: String!

    """
    The conclusion of fact checking for this information.
    """
    conclusion: Conclusion!

    """
    Further explanation for the fact check conclusion.
    """
    explanation: String!

    """
    The person or entity who authored the report.
    """
    author: String

    """
    The ID of the publisher of the fact check report.
    """
    publisherId: ID!

    """
    The URL of the full report where the public can get more infomation
    about this fact check report.
    """
    fullReportUrl: URL

    """
    The time when this fact check report is published.
    """
    publishedAt: Date

    """
    The tags of this fact check report.
    """
    tags: [String!]!

    """
    Original message that was fact checked by the publisher.
    """
    originalMessage: String

    """
    Original URLs that were fact checked by the publisher.
    """
    originalUrls: [URL!]
  }

  """
  The result for create report.
  """
  type CreateReportPayload {
    """
    The created fact check report.
    """
    report: Report!
  }

  """
  The input for update report.
  """
  input UpdateReportInput {
    """
    The ID of the report to be updated.
    """
    id: ID!

    """
    One line summary for describing the fact checked information.
    """
    summary: String

    """
    The conclusion of fact checking for this information.
    """
    conclusion: Conclusion

    """
    Further explanation for the fact check conclusion.
    """
    explanation: String

    """
    The person or entity who authored the report.
    """
    author: String

    """
    The URL of the full report where the public can get more infomation
    about this fact check report.
    """
    fullReportUrl: URL

    """
    The time when this fact check report is published.
    """
    publishedAt: Date

    """
    The tags of this fact check report.
    """
    tags: [String!]

    """
    Original message that was fact checked by the publisher.
    """
    originalMessage: String

    """
    Original URLs that were fact checked by the publisher.
    """
    originalUrls: [URL!]
  }

  """
  The result for update report.
  """
  type UpdateReportPayload {
    """
    The updated fact check report.
    """
    report: Report!
  }

  """
  The input for delete report.
  """
  input DeleteReportInput {
    """
    The ID of the report to be deleted.
    """
    id: ID!
  }

  """
  The result for delete report.
  """
  type DeleteReportPayload {
    """
    The ID of the report that is deleted.
    """
    reportId: ID!
  }
`;
