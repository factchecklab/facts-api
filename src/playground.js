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
      endpoint: '',
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
