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

export const airtableToModel = async (record, options, context) => {
  const { sequelize, storage, models, logger } = context;
  logger.debug(`Got submitted report record ${record.id}.`);

  // find existing report and prepare for update data
  let report = await models.Report.findOne({
    where: {
      airtableId: record.id,
    },
  });
  let attachments = [];

  const modelData = {
    content: record.fields['Content'] || '',
    source: record.fields['Source'] || '',
    url: record.fields['URL'] || '',
    airtableId: record.id,
    airtableUpdatedAt: new Date(record.fields['Last Modified Time']),
  };

  // create a new report or update an existing report
  if (report) {
    logger.debug(`Found existing report model ${report.id}, updating`);
    report.set(modelData);

    attachments = await report.getAttachments();
  } else {
    logger.debug(`Creating new report model for airtable record`);
    report = models.Report.build(modelData);
  }

  // attachments
  record.fields['Attachments'] = record.fields['Attachments'] || [];

  // find new attachments to create
  const attachmentsToCreate = await Promise.all(
    record.fields['Attachments']
      .filter((attachment) => {
        return (
          attachments.findIndex((att) => att.airtableId === attachment.id) ===
          -1
        );
      })
      .map(async (attachment) => {
        let asset = models.Asset.build(
          await uploadAssetFromUrl(storage, attachment.url, {
            filename: attachment.filename,
            contentType: attachment.type,
          })
        );

        // the asset is saved to database first to obtain an asset id
        // this operation is not part of a transaction
        asset = await asset.save({ returning: true });

        return models.Attachment.build({
          type: 'asset',
          assetId: asset.id,
          airtableId: attachment.id,
        });
      })
  );

  // find existing attachments to destroy
  const attachmentsToDestroy = attachments.filter((attachment) => {
    return (
      record.fields['Attachments'].findIndex(
        (att) => att.id === attachment.airtableId
      ) === -1
    );
  });

  // commit to database
  return sequelize.transaction(async (t) => {
    const opts = { transaction: t };
    report = await report.save({ ...opts, returning: true });
    await Promise.all(
      attachmentsToCreate.map((attachment) => {
        attachment.itemType = 'report';
        attachment.itemId = report.id;
        return attachment.save(opts);
      })
    );
    await Promise.all(
      attachmentsToDestroy.map((attachment) => {
        return attachment.destroy(opts);
      })
    );
    return report;
  });
};

export const fetchAndUpdate = async (client, date, context) => {
  const { logger } = context;
  const table = getTable(client, context);

  const selectOptions = {
    sort: [{ field: 'Last Modified Time', direction: 'asc' }],
  };

  if (date) {
    selectOptions.filterByFormula = `{Last Modified Time} > '${date.toISOString()}'`;
  } else {
    selectOptions.filterByFormula = `{Last Modified Time}`;
  }

  const query = table.select(selectOptions);

  logger.debug('Querying airtable for submitted reports records');
  let recordCount = 0;
  let errorCount = 0;
  await query.eachPage(async (records, fetchNextPage) => {
    logger.debug(`Got ${records.length} records from airtable`);
    await Promise.all(
      records.map(async (record) => {
        try {
          return await airtableToModel(record, {}, context);
        } catch (error) {
          logger.debug(JSON.stringify(record));
          logger.error('Error occurred while calling airtableToModel: ', error);
          errorCount += 1;
        }
      })
    );
    recordCount += records.length;

    logger.debug('Attempt to fetch next page');
    fetchNextPage();
  });

  logger.info(
    `Fetched ${recordCount} reports and updated with ${errorCount} errors.`
  );
};

export const saveNew = async (client, context) => {
  const { logger, models } = context;

  const reports = await models.Report.findAll({
    where: {
      airtableId: null,
    },
  });

  let reportCount = 0;
  let errorCount = 0;
  await Promise.all(
    reports.map(async (report) => {
      try {
        reportCount += 1;
        return await modelToAirtable(client, report, {}, context);
      } catch (error) {
        logger.error('Error occurred while calling modelToAirtable: ', error);
        errorCount += 1;
      }
    })
  );

  logger.info(
    `Found ${reportCount} reports without airtable ID and saving to airtable, with ${errorCount} errors.`
  );
};
