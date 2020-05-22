import {
  save as saveElastic,
  remove as removeElastic,
} from '../../search/report';
import { modelToAirtable } from '../../airtable/report';

const init = ({ Report }, context, hookOptions) => {
  let { disableAirtable } = hookOptions || {};
  const { airtable, elastic, logger } = context;

  if (!disableAirtable && !process.env.AIRTABLE_API_KEY) {
    logger.info(
      'Airtable hook disabled because AIRTABLE_API_KEY is not configured.'
    );
    disableAirtable = true;
  }

  Report.addHook('afterSave', async (report, options) => {
    const hook = async () => {
      if (!disableAirtable) {
        try {
          await modelToAirtable(airtable, report, { hooks: false }, context);
        } catch (error) {
          logger.error(
            `Error occurred while saving Report with ID ${report.id} to airtable:`,
            error
          );
        }
      }

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
    try {
      if (options.transaction) {
        await options.transaction.afterCommit(async () => {
          await removeElastic(elastic, report, { hooks: false });
        });
      } else {
        await removeElastic(elastic, report, { hooks: false });
      }
    } catch (error) {
      logger.error(
        `Error occurred while removing index for Report with ID ${report.id}:`,
        error
      );
    }
  });
};

export default init;
