//= require ../core/_package.js

var triflow_dataflow_pause = -1;
var triflow_dataflow_continue = 1;
var triflow_dataflow_EOF = 0;
var triflow_dataflow_DATA = 1;

triflow.element = {
  AGGREGATE: 'Aggregate',
  BUFFER: 'Buffer',
  ELEMENT: 'Element',
  FILE_SOURCE: 'FileSource',
  FILTER: 'Filter',
  HASH_JOIN: 'HashJoin',
  MAP: 'Map',
  STRING_SOURCE: 'StringSource',
  TUPLE_ELEMENT: 'TupleElement',
  DATA: triflow_dataflow_DATA,
  EOF: triflow_dataflow_EOF
};

