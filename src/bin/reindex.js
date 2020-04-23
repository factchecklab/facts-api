import models from '../models';
import hooks, { client } from '../search';

const reindex = async () => {
  const reports = await models.Report.findAll();
  await Promise.all(
    reports.map((report) => {
      return hooks.Report.save(client, report);
    })
  );
  const topics = await models.Topic.findAll();
  await Promise.all(
    topics.map((topic) => {
      return hooks.Topic.save(client, topic);
    })
  );
};

(async function main() {
  await reindex();
  console.log('Done');
})();
