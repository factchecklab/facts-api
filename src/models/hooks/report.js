import {
  save as saveElastic,
  remove as removeElastic,
} from '../../search/report';

  Report.addHook('afterSave', async (report, options) => {
    try {
      if (options.transaction) {
        await options.transaction.afterCommit(async () => {
          await saveElastic(elastic, report, { hooks: false });
        });
      } else {
        await saveElastic(elastic, report, { hooks: false });
      }
    } catch (error) {
      console.error(
        `Error occurred while indexing Report with ID ${report.id}:`,
        error
      );
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
      console.error(
        `Error occurred while removing index for Report with ID ${report.id}:`,
        error
      );
    }
  });
};

export default init;
