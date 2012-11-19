function triflow_functor(v) {
  return typeof v === 'function' ? v : function() { return v; };
}

triflow.functor = triflow_functor;
