import gql from 'graphql-tag';

export default gql`
  extend type Query {
    partners: [Partner!]
    partner(id: ID!): Partner
  }

  type Partner {
    id: ID!
    name: String!
    homepage: String
  }
`;

