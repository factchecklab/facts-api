// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import gql from 'graphql-tag';

export default gql`
  extend type Query {
    """
    List of publishers.
    """
    publishers(
      after: Cursor
      before: Cursor
      first: Int
      reverse: Boolean
    ): PublisherConnection!

    """
    A publisher.
    """
    publisher(
      """
      ID of the publisher.
      """
      id: ID!
    ): Publisher
  }

  type PublisherConnection {
    """
    A list of edges.
    """
    edges: [PublisherEdge!]

    """
    A list of nodes.
    """
    nodes: [Publisher!]

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
  Publisher edge.
  """
  type PublisherEdge {
    """
    Cursor for pagination.
    """
    cursor: String!

    """
    The node of this edge.
    """
    node: Publisher
  }

  """
  Represents a publisher of fact check report.
  """
  type Publisher {
    """
    The ID of the publisher.
    """
    id: ID!

    """
    The name of the publisher.
    """
    name: String!

    """
    The URL of the publisher website.
    """
    url: String

    """
    List of reports published by this publisher.
    """
    reports(
      after: Cursor
      before: Cursor
      first: Int
      reverse: Boolean
    ): ReportConnection!
  }
`;
