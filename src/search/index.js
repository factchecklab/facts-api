import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';

import report from './report';
import topic from './topic';

dotenv.config();

export const client = new Client({ node: process.env.ELASTICSEARCH_ENDPOINT });

const search = {
  Report: report,
  Topic: topic,
};

export default search;
