// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Op } from 'sequelize';

const getPagingOp = (forward, direction) => {
  if ((forward && direction === 'asc') || (!forward && direction === 'desc')) {
    return Op.gt;
  } else {
    return Op.lt;
  }
};

export const buildPagableQuery = (pargs, [attr, dir]) => {
  const { forward, limit, reverse, cursor } = pargs;
  const pagingOp = getPagingOp(forward, dir);
  let where = {};
  if (cursor) {
    where = {
      [Op.or]: [
        {
          [attr]: {
            [pagingOp]: cursor[0],
          },
        },
        {
          [Op.and]: {
            [attr]: cursor[0],
            id: {
              [pagingOp]: cursor[1],
            },
          },
        },
      ],
    };
  }

  if (reverse) {
    dir = dir === 'asc' ? 'desc' : 'asc';
  }

  return {
    where,
    limit: limit + 1,
    order: [
      [attr, dir],
      ['id', dir],
    ],
  };
};
