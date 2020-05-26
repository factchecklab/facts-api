@{%
const moo = require("moo");

const lexer = moo.compile({
  ws:     /[ \t]+/,
  para_open: /\(/,
  para_close: /\)/,
  op_not: /NOT/,
  op_and: /AND/,
  op_or: /OR/,
  hyphen: /-/,
  colon: /:/,
  comma: /,/,
  lt: /</,
  gt: />/,
  literal: /[^\s:,\(\)\-<>"']+/,
  dquote_literal: /"(?:[^"\\]|\\.)*"/,
  squote_literal: /'(?:[^'\\]|\\.)*'/
});
%}

@lexer lexer

# Rules are ordered by increasing order of precedence.

# Logical operators
# Example: expression OR expression AND NOT expression

union -> union %ws %op_or %ws intersect {% ([lhs, , , , rhs]) => {
  return {
    type: 'or',
    children: [lhs, rhs]
  };
} %}
union -> intersect {% ([expr]) => expr %}

intersect -> intersect %ws %op_and %ws negate {% ([lhs, , , , rhs]) => {
  return {
    type: 'and',
    children: [lhs, rhs]
  };
} %}
intersect -> negate {% ([expr]) => expr %}

negate -> %op_not %ws grouping {% ([, , expr]) => {
  return {
    type: 'not',
    children: [expr]
  };
} %}
negate -> grouping {% ([expr]) => expr %}

# Grouping
# Example: (expression OR expression) AND expression

grouping -> %para_open _ union _ %para_close {% ([, , inner, , ]) => inner %}
grouping -> conditions {% ([expr]) => expr %}

# Conditions
# Example: title:hello -content:world

conditions -> condition_list {% ([list]) => {
  return {
    type: 'conditions',
    children: list
  };
} %}

condition_list -> condition_list %ws condition {% ([lhs, , rhs]) => lhs.concat([rhs]) %}
                | condition {% ([expr]) => [expr] %}

condition -> %hyphen:? field_spec:? value_spec {% ([op, lhs, rhs]) => {
  return {
    type: rhs.type,
    negate: !!op,
    field: lhs,
    children: rhs.children
  }
} %}

# Field specifiers
# Example: title:

field_spec -> %literal %colon {% ([literal]) => literal %}

# Value specifiers
# Example: "hello world",goodbye
# Example: from-to
# Example: from-
# Example: >from
# Example: <to
# Example: -to

value_spec -> value_choice_spec {% ([expr]) => expr %}
            | value_range_spec {% ([expr]) => expr %}

value_choice_spec -> value_choice_spec_list {% ([list]) => {
  return {
    type: 'choice',
    children: list
  };
} %}

value_choice_spec_list -> value_choice_spec_list %comma value {% ([lhs, , rhs]) => lhs.concat([rhs]) %}
                        | value {% ([expr]) => [expr] %}

value_range_spec -> value:? %hyphen value:? {% ([lhs, , rhs]) => {
  return {
    type: 'range',
    children: [lhs, rhs],
  };
} %}
value_range_spec -> %lt value {% ([, expr]) => {
  return {
    type: 'range',
    children: [null, expr],
  };
} %}
value_range_spec -> %gt value {% ([, expr]) => {
  return {
    type: 'range',
    children: [expr, null],
  };
} %}

# Values
# Example: "hello world"
# Example: 'hello world'
# Example: hello

value -> %literal {% ([expr]) => expr %}
value -> %dquote_literal {% ([expr]) => expr %}
value -> %squote_literal {% ([expr]) => expr %}

_ -> %ws:?
__ -> %ws:+
#ws -> %ws
