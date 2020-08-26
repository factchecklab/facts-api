// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  save as saveElastic,
  remove as removeElastic,
} from '../../search/report';

const init = ({ Report }, context, hookOptions) => {
  const { elastic, logger } = context;

  Report.addHook('afterSave', async (report, options) => {
    const hook = async () => {
      try {
        await saveElastic(elastic, report, { hooks: false });
      } catch (error) {
        logger.error(
          `Error occurred while indexing Report with ID ${report.id}:`,
          error
        );
      }
    };

    if (options.transaction) {
      await options.transaction.afterCommit(hook);
    } else {
      await hook();
    }
  });

  Report.addHook('afterDestroy', async (report, options) => {
    const hook = async () => {
      try {
        await removeElastic(elastic, report, { hooks: false });
      } catch (error) {
        logger.error(
          `Error occurred while indexing Report with ID ${report.id}:`,
          error
        );
      }
    };

    if (options.transaction) {
      await options.transaction.afterCommit(hook);
    } else {
      await hook();
    }
  });
};

export default init;
