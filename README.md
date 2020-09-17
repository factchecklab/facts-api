<!--
SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Factcheck DB API

The Factcheck DB is a database for exchanging information about fact check
reports. The server expose this database with a GraphQL API.

## Features

* Query fact check reports.
* Find related fact check report with potential misinformation.
* Publish fact check reports by publishers.

To try out the Factcheck DB API, head over to
[GraphQL Playground](https://api.factchecklab.org/graphql/facts) and start
querying!

## Developing

### Requirements

* Node.js
* PostgreSQL
* ElasticSearch

### Getting started

First of all, create `.env` file which contains all the server settings. Copy
from `.env.example` as an example. Check that all backing services are running
beforehand.

```
$ yarn install
$ yarn migrate
$ yarn dev
```

If you use Docker, the repository contains a Docker Compose file which
help you start the required services for you.

```
$ docker-compose up -d postgres elasticsearch
$ docker-compose run --rm api yarn install
$ docker-compose run --rm api yarn migrate
$ docker-compose up app
```

The server listen at port 4000. Browse to `http://localhost:4000` for GraphQL
Playground and use the same URL for GraphQL API endpoint.

## Contributing

We welcome contributions to our projects! You can ask questions or [file a bug
report](https://gitlab.com/factchecklab/facts-api/-/issues/new) by creating an
issue on GitLab. To contribute, fork this repository on
GitLab and create a merge request.

## Getting Help

If you have questions, [file an issue](https://gitlab.com/factchecklab/facts-api/-/issues/new)
in our repository on GitLab, you can
also contact us at [tech@factchecklab.org](mailto:tech@factchecklab.org).

## Copyright & License

Copyright (c) 2020 tech@factchecklab.

The source code is licensed under Affero General Public License Version 3.
