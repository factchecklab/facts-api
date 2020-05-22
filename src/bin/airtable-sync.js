import context from '../context';
import initReportHook from '../models/hooks/report';
import { fetchAndUpdate, saveNew } from '../airtable/report';

const fetch = async (ctx) => {
  const { logger, airtable } = ctx;
  logger.info('Running airtable fetch reports job');
  const updatedAt = null; // TODO(cheungpat): persist this info to database
  if (updatedAt) {
    logger.info(
      `Most recent updated date is ${updatedAt.toISOString()}. Will query airtable for records later than this date.`
    );
  } else {
    logger.info(
      `Unable to find most recent updated date in records table. Will query airtable for all records.`
    );
  }
  await fetchAndUpdate(airtable, updatedAt, ctx);
  await saveNew(airtable, ctx);
};

(async function main() {
  const ctx = context();
  initReportHook(ctx.models, ctx, { disableAirtable: true });
  await fetch(ctx);
})();
