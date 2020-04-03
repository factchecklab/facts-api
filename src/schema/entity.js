import gql from 'graphql-tag';

export default gql`
  extend type Query {
    entities: [Entity!]
    entity(id: ID!): Entity
  }

  type Entity {
    id: ID!
    name: String!
    homepage: String
  }
`;
