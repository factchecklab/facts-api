// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import gql from 'graphql-tag';

export default gql`
  enum AuthGroup {
    ADMIN
    PUBLISHER
  }

  directive @stub on FIELD_DEFINITION | ARGUMENT_DEFINITION
  directive @auth(requires: AuthGroup = ADMIN) on FIELD_DEFINITION
`;
