// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

const splitGroups = (groupString, prefix) => {
  if (!groupString) {
    return [];
  }

  return groupString
    .split(',')
    .map((g) => g.trim().toLowerCase())
    .map((g) => {
      if (!prefix) {
        return g;
      }

      if (g.startsWith(prefix)) {
        return g.substring(prefix.length);
      } else {
        return '';
      }
    })
    .filter((g) => !!g);
};

export const getConsumer = (req, groupPrefix) => {
  if (!req) {
    return null;
  }

  const id = req.headers['x-consumer-id'];
  if (!id) {
    return null;
  }

  return {
    id: req.headers['x-consumer-id'],
    customId: req.headers['x-consumer-custom-id'] || null,
    username: req.headers['x-consumer-username'] || null,
    isAnonymous: req.headers['x-anonymous-consumer'] === 'true',
    groups: splitGroups(req.headers['x-consumer-groups'], groupPrefix),
  };
};
