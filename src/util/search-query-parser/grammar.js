// Generated automatically by nearley, version 2.19.3
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "union", "symbols": ["union", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("op_or") ? {type: "op_or"} : op_or), (lexer.has("ws") ? {type: "ws"} : ws), "intersect"], "postprocess":  ([lhs, , , , rhs]) => {
          return {
            type: 'or',
            children: [lhs, rhs]
          };
        } },
    {"name": "union", "symbols": ["intersect"], "postprocess": ([expr]) => expr},
    {"name": "intersect", "symbols": ["intersect", (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("op_and") ? {type: "op_and"} : op_and), (lexer.has("ws") ? {type: "ws"} : ws), "negate"], "postprocess":  ([lhs, , , , rhs]) => {
          return {
            type: 'and',
            children: [lhs, rhs]
          };
        } },
    {"name": "intersect", "symbols": ["negate"], "postprocess": ([expr]) => expr},
    {"name": "negate", "symbols": [(lexer.has("op_not") ? {type: "op_not"} : op_not), (lexer.has("ws") ? {type: "ws"} : ws), "grouping"], "postprocess":  ([, , expr]) => {
          return {
            type: 'not',
            children: [expr]
          };
        } },
    {"name": "negate", "symbols": ["grouping"], "postprocess": ([expr]) => expr},
    {"name": "grouping", "symbols": [(lexer.has("para_open") ? {type: "para_open"} : para_open), "_", "union", "_", (lexer.has("para_close") ? {type: "para_close"} : para_close)], "postprocess": ([, , inner, , ]) => inner},
    {"name": "grouping", "symbols": ["conditions"], "postprocess": ([expr]) => expr},
    {"name": "conditions", "symbols": ["condition_list"], "postprocess":  ([list]) => {
          return {
            type: 'conditions',
            children: list
          };
        } },
    {"name": "condition_list", "symbols": ["condition_list", (lexer.has("ws") ? {type: "ws"} : ws), "condition"], "postprocess": ([lhs, , rhs]) => lhs.concat([rhs])},
    {"name": "condition_list", "symbols": ["condition"], "postprocess": ([expr]) => [expr]},
    {"name": "condition$ebnf$1", "symbols": [(lexer.has("hyphen") ? {type: "hyphen"} : hyphen)], "postprocess": id},
    {"name": "condition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition$ebnf$2", "symbols": ["field_spec"], "postprocess": id},
    {"name": "condition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition", "symbols": ["condition$ebnf$1", "condition$ebnf$2", "value_spec"], "postprocess":  ([op, lhs, rhs]) => {
          return {
            type: rhs.type,
            negate: !!op,
            field: lhs,
            children: rhs.children
          }
        } },
    {"name": "field_spec", "symbols": [(lexer.has("literal") ? {type: "literal"} : literal), (lexer.has("colon") ? {type: "colon"} : colon)], "postprocess": ([literal]) => literal},
    {"name": "value_spec", "symbols": ["value_choice_spec"], "postprocess": ([expr]) => expr},
    {"name": "value_spec", "symbols": ["value_range_spec"], "postprocess": ([expr]) => expr},
    {"name": "value_choice_spec", "symbols": ["value_choice_spec_list"], "postprocess":  ([list]) => {
          return {
            type: 'choice',
            children: list
          };
        } },
    {"name": "value_choice_spec_list", "symbols": ["value_choice_spec_list", (lexer.has("comma") ? {type: "comma"} : comma), "value"], "postprocess": ([lhs, , rhs]) => lhs.concat([rhs])},
    {"name": "value_choice_spec_list", "symbols": ["value"], "postprocess": ([expr]) => [expr]},
    {"name": "value_range_spec$ebnf$1", "symbols": ["value"], "postprocess": id},
    {"name": "value_range_spec$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "value_range_spec$ebnf$2", "symbols": ["value"], "postprocess": id},
    {"name": "value_range_spec$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "value_range_spec", "symbols": ["value_range_spec$ebnf$1", (lexer.has("hyphen") ? {type: "hyphen"} : hyphen), "value_range_spec$ebnf$2"], "postprocess":  ([lhs, , rhs]) => {
          return {
            type: 'range',
            children: [lhs, rhs],
          };
        } },
    {"name": "value_range_spec", "symbols": [(lexer.has("lt") ? {type: "lt"} : lt), "value"], "postprocess":  ([, expr]) => {
          return {
            type: 'range',
            children: [null, expr],
          };
        } },
    {"name": "value_range_spec", "symbols": [(lexer.has("gt") ? {type: "gt"} : gt), "value"], "postprocess":  ([, expr]) => {
          return {
            type: 'range',
            children: [expr, null],
          };
        } },
    {"name": "value", "symbols": [(lexer.has("literal") ? {type: "literal"} : literal)], "postprocess": ([expr]) => expr},
    {"name": "value", "symbols": [(lexer.has("dquote_literal") ? {type: "dquote_literal"} : dquote_literal)], "postprocess": ([expr]) => expr},
    {"name": "value", "symbols": [(lexer.has("squote_literal") ? {type: "squote_literal"} : squote_literal)], "postprocess": ([expr]) => expr},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]}
]
  , ParserStart: "union"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
