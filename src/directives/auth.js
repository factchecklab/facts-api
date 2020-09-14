// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql';
import { AuthenticationError, ForbiddenError } from 'apollo-server-koa';

const validateConsumer = (consumer, requires) => {
  if (!consumer || consumer.isAnonymous) {
    throw new AuthenticationError('not authenticated');
  }

  const { groups } = consumer;

  // Either the API consumer is an admin or that it belongs to a group required
  // by the directive.
  if (!(groups.includes('admin') || groups.includes(requires.toLowerCase()))) {
    throw new ForbiddenError('not authorized');
  }
};

export default class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = (...args) => {
      const [, , context] = args;
      const { requires } = this.args;

      validateConsumer(context.consumer, requires);
      return resolve.apply(this, args);
    };
  }
}
