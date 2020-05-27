import nearley from 'nearley';
import grammar from './grammar';

const DEFAULT_FIELD = 'text';

/**
 * Parse a query using specified clause builder.
 *
 * The builder is an object with supported field as keys and a callback function
 * for building elasticsearch boolean query clause. Callback function
 * takes an array of values as arguemnt.
 *
 * When query is malformed, the parser will treat entire string as simple
 * text query. If options.throwError is true, an error is thrown instead.
 */
export const parse = (query, builder, options) => {
  const { throwError } = options || {};

  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  try {
    parser.feed(query);
    if (parser.results.length === 0) {
      // The parser does not return a result nor has it thrown an error.
      // It is still expecting input, hence the input is invalid.
      throw new Error('Expecting input but the string ended too early.');
    }

    // uncomment to debug print parser result
    // console.log(JSON.stringify(parser.results[0], null, 2));
    return parseLogicalExpression(parser.results[0], builder);
  } catch (error) {
    if (throwError) {
      throw error;
    }

    // This is the fallback in case the query is not recognised. The
    // whole string will be treated as simple text.
    const buildfn = builder[DEFAULT_FIELD];
    if (buildfn) {
      const clause = buildfn([query]);
      if (clause) {
        // clause can be an array or an object
        return {
          must: clause,
        };
      }
    }
    return {};
  }
};

/**
 * This is a recursive parse function to descend into query AST for converting
 * it into an elasticsearch boolean query. The descend ends when it
 * finds a 'conditions' type.
 */
const parseLogicalExpression = (obj, builder) => {
  switch (obj.type) {
    case 'conditions':
      return parseConditionsExpression(obj, builder);
    case 'and':
      return {
        must: obj.children.map((child) => {
          return { bool: parseLogicalExpression(child, builder) };
        }),
      };
    case 'or':
      return {
        should: obj.children.map((child) => {
          return { bool: parseLogicalExpression(child, builder) };
        }),
        minimum_should_match: 1, // eslint-disable-line camelcase
      };
    case 'not':
      return {
        // eslint-disable-next-line camelcase
        must_not: obj.children.map((child) => {
          return { bool: parseLogicalExpression(child, builder) };
        }),
      };
  }
};

/**
 * This is a parse function for converting a list of search conditions
 * into a elasticsearch boolean query.
 */
const parseConditionsExpression = (obj, builder) => {
  const bool = obj.children.reduce(
    (result, { negate, field, children }) => {
      const fieldName = field ? parseLiteralExpression(field) : DEFAULT_FIELD;
      const buildfn = builder[fieldName];
      if (buildfn) {
        // eslint-disable-next-line camelcase
        const target = negate ? result.must_not : result.must;

        let clause = buildfn(children.map(parseLiteralExpression));
        if (clause) {
          if (Array.isArray(clause)) {
            target.push(...clause);
          } else {
            target.push(clause);
          }
        }
      }
      return result;
    },
    {
      must: [],
      must_not: [], // eslint-disable-line camelcase
    }
  );

  return bool;
};

const parseLiteralExpression = (obj) => {
  return obj ? obj.text : null;
};

export { terms, prefixterms, match, multimatch, range } from './helper';
export default parse;
