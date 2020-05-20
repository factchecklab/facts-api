import { save, remove } from '../../search/topic';

const init = ({ Topic }, { elastic }) => {
  Topic.addHook('afterSave', async (topic, options) => {
    try {
      await save(elastic, topic, options);
    } catch (error) {
      console.error(
        `Error occurred while indexing Topic with ID ${topic.id}:`,
        error
      );
    }
  });
  Topic.addHook('afterDestroy', async (topic, options) => {
    try {
      await remove(elastic, topic, options);
    } catch (error) {
      console.error(
        `Error occurred while removing index for Topic with ID ${topic.id}:`,
        error
      );
    }
  });
};

export default init;
