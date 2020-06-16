import gql from 'graphql-tag';
import { print } from 'graphql';

export default {
  settings: {
    'editor.theme': 'light',
  },
  tabs: [
    {
      name: 'List reports',
      responses: ['{}'],
      endpoint:
        process.env.GRAPHQL_PLAYGROUND_ENDPOINT ||
        'https://api.factchecklab.org/graphql/facts',
      query: [
        '# List reports',
        print(gql`
          query {
            reports {
              nodes {
                summary
                explanation
                conclusion
                fullReportUrl
              }
            }
          }
        `),
      ].join('\n'),
    },
  ],
};
