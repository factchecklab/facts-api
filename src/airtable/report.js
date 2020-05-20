import { generateAssetUrl, uploadAssetFromUrl } from '../util/asset';

const getTable = (client, { logger }) => {
  const baseId = process.env.AIRTABLE_REPORT_BASE_ID;
  if (!baseId) {
    throw new Error('AIRTABLE_REPORT_BASE_ID is not configured');
  }
  return client.base(baseId).table('Submitted Reports');
};

export const modelToAirtable = async (client, report, options, context) => {
  const { sequelize, storage, logger } = context;
  const table = getTable(client, context);

  const attachments = await report.getAttachments();
  const recordData = {
    'Server ID': report.id,
    Content: report.content,
    Source: report.source,
    URL: report.url,
    'Report Time': report.createdAt,
    Attachments: await Promise.all(
      attachments.map(async (attachment) => {
        if (attachment.airtableId) {
          // existing attachment
          return {
            id: attachment.airtableId,
          };
        }

        // new attachments
        const asset = await attachment.getAsset();
        return {
          url: await generateAssetUrl(storage, asset, {}),
          filename: asset.filename,
        };
      })
    ),
  };

  // update or create airtable
  let newRecord;
  if (report.airtableID) {
    logger.debug(
      `Report ${report.id} has airtable ID ${report.airtableID}, updating.`
    );
    newRecord = await table.update(report.airtableId, recordData);
  } else {
    logger.debug(`Report ${report.id} does not have an airtable ID, creating.`);
    newRecord = await table.create(recordData);
  }

  // update model with airtable ID and last modified time
  await sequelize.transaction(async (t) => {
    const opts = { ...options, transaction: t };

    report.airtableId = newRecord.id;
    const lastModifiedTime = newRecord.fields['Last Modified Time'];
    if (lastModifiedTime) {
      report.airtableUpdatedAt = new Date(lastModifiedTime);
    }
    await report.save(opts);

    logger.debug(
      `Report ${report.id} updated with new airtableUpdatedAt=${report.airtableUpdatedAt}.`
    );

    const attachmentsInRecord = newRecord.fields.Attachments || [];
    if (attachments.length === attachmentsInRecord.length) {
      // Assume that the order of our attachments is the same as that of theirs
      await Promise.all(
        attachmentsInRecord.map(async (airtableAttachment, index) => {
          const ourAttachment = attachments[index];
          ourAttachment.airtableId = airtableAttachment.id;
          await ourAttachment.save(opts);
        })
      );
    }
  });
};
