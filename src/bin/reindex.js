// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import models from '../models';
import hooks, { client } from '../search';

const reindex = async () => {
  const reports = await models.Report.findAll();
  await Promise.all(
    reports.map((report) => {
      return hooks.Report.save(client, report);
    })
  );
};

(async function main() {
  await reindex();
  console.log('Done');
})();
