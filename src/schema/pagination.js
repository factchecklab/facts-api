import gql from 'graphql-tag';

export default gql`
  scalar Cursor

  """
  Information about pagination.
  """
  type PageInfo {
    """
    The cursor to use when paging backward.
    """
    startCursor: Cursor

    """
    The cursor to use when paging forward.
    """
    endCursor: Cursor

    """
    Whether there are more items when paging forward.
    """
    hasNextPage: Boolean!

    """
    Whether there are more items when paging backward.
    """
    hasPreviousPage: Boolean!
  }
`;
