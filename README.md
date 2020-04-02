# Maat Response API Server

## Getting Started

1. Copy .env to .env.sample
2. Run yarn install
3. Run yarn start

Or you can use `docker-compose up`. The API is available on port 4000.

Currently, the server creates database schema upon server starts.

## TODOs

The project is in active development. The current state of the project:

- [ ] Prettier / Lint
- [ ] Tests
- [ ] Build commands (babel emits js into dist directory)
- [ ] CI / CD
- [ ] Database migration up/down
- [x] Simple queries schema and resolver, like query all and fetch by one
- [x] Simple graph traversal, like fetching topic responses
- [ ] Query schema to support application use cases
- [ ] Mutation schema to support application use cases
- [ ] Support published state, showing/hiding objects for all users
- [ ] Sorting by order field, to support which response appears first
- [ ] Assets / Attachments
- [ ] ElasticSearch connection
