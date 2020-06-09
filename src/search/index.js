import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';

import report from './report';

dotenv.config();

export const client = new Client({ node: process.env.ELASTICSEARCH_ENDPOINT });

const search = {
  Report: report,
};

export default search;
