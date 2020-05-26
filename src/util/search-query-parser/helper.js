const isQuotedString = (str) => {
  return str.startsWith('"') || str.endsWith("'");
};

const unquoteString = (str) => {
  if (!isQuotedString(str)) {
    return str;
  }

  return str.substring(1, str.length - 1).replace(/\\/g, '');
};

export const terms = (fieldname, values) => {
  if (!Array.isArray(values) || !values.length) {
    return null;
  }
  return { terms: { [fieldname]: values.map(unquoteString) } };
};

export const prefixterms = (exactField, prefixField, values) => {
  if (!Array.isArray(values)) {
    return null;
  }

  const [exactValues, prefixValues] = values.reduce(
    (result, v) => {
      const value = unquoteString(v);
      if (value.endsWith('_*')) {
        result[1].push(value.replace(/_\*$/, ''));
      } else {
        result[0].push(value);
      }
      return result;
    },
    [[], []]
  );

  const subClauses = [
    terms(prefixField, prefixValues),
    terms(exactField, exactValues),
  ].filter((v) => v);

  if (subClauses.length === 0) {
    return null;
  } else if (subClauses.length === 1) {
    return subClauses[0];
  } else {
    return { bool: { should: subClauses } };
  }
};

export const match = (fieldname, values) => {
  if (!Array.isArray(values) || !values.length) {
    return null;
  }

  const subClauses = values.map((value) => {
    if (isQuotedString(value)) {
      // eslint-disable-next-line camelcase
      return { match_phrase: { [fieldname]: unquoteString(value) } };
    } else {
      return { match: { [fieldname]: value } };
    }
  });
  return subClauses.length === 1
    ? subClauses[0]
    : { bool: { should: subClauses } };
};

export const multimatch = (fieldnames, values) => {
  if (!Array.isArray(values)) {
    return null;
  }
  const filteredValues = values.filter((value) => value.length);
  if (!filteredValues.length) {
    return null;
  }

  const subClauses = filteredValues.map((value) => {
    return {
      // eslint-disable-next-line camelcase
      multi_match: {
        query: unquoteString(value),
        type: isQuotedString(value) ? 'phrase' : 'best_fields',
        fields: fieldnames,
      },
    };
  });
  return subClauses.length === 1
    ? subClauses[0]
    : { bool: { should: subClauses } };
};

export const range = (fieldname, values) => {
  if (!Array.isArray(values) || values.length !== 2) {
    return null;
  }

  const [from, to] = values;
  if (!from && !to) {
    return null;
  }

  const rangeObj = {};
  if (from) {
    rangeObj.from = from;
  }
  if (to) {
    rangeObj.to = to;
  }

  return { range: { [fieldname]: rangeObj } };
};
