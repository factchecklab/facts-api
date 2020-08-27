// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export const stringifyCursor = (cursor) => {
  return Buffer.from(JSON.stringify(cursor)).toString('base64');
};

export const parsePagingCursor = (cursorString) => {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursorString, 'base64').toString('ascii')
    );
    return Array.isArray(parsed) ? parsed : undefined;
  } catch (e) {
    return undefined;
  }
};

export const parseRelayPaginationArgs = (args, opts = {}) => {
  const defaultLimit = opts.defaultLimit || 100;
  const maxLimit = opts.maxLimit || 100;

  const forward = !!args.after || !args.before;
  const afterCursor = args.after || args.before || undefined;
  const reverse = !forward || args.reverse;
  const limit = Math.min(args.first || defaultLimit, maxLimit);
  const cursor = parsePagingCursor(afterCursor);

  return {
    forward,
    reverse,
    limit,
    cursor,
  };
};

export const makeRelayConnection = (edges, pargs = null) => {
  const limit = (pargs && pargs.limit) || 0;
  const forward = pargs && pargs.forward !== undefined ? pargs.forward : true;
  const hasMore = limit && edges.length > limit;

  if (limit) {
    edges.splice(limit);
  }

  if (!forward) {
    edges.reverse();
  }

  return {
    edges,
    nodes: edges.map((edge) => edge.node),
    pageInfo: {
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNextPage: forward && hasMore,
      hasPreviousPage: !forward && hasMore,
    },
  };
};
