// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import gql from 'graphql-tag';

export default gql`
  extend type Query {
    """
    List of report tags.
    """
    reportTags(after: Cursor, before: Cursor, first: Int): ReportTagConnection!

    """
    A report tag.
    """
    reportTag(
      """
      Name of the report tag.
      """
      name: String!
    ): ReportTag
  }

  """
  Report tag connection.
  """
  type ReportTagConnection {
    """
    A list of edges.
    """
    edges: [ReportTagEdge!]

    """
    A list of nodes.
    """
    nodes: [ReportTag!]

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
  Report tag edge.
  """
  type ReportTagEdge {
    """
    Cursor for pagination.
    """
    cursor: String!

    """
    The node of this edge.
    """
    node: ReportTag
  }

  """
  Represents a report tag.
  """
  type ReportTag {
    """
    The name of the tag.
    """
    name: String!

    """
    List of fact check reports for this tag.
    """
    reports(
      after: Cursor
      before: Cursor
      first: Int
      reverse: Boolean
    ): ReportConnection!
  }
`;
