require('./compile');
snockets.getCompiledChain(requireTreeFile, flags, function(err, graph) {
  var fileNames = (_.pluck(graph, 'filename'));
  // Remove unneeded file.
  fileNames.pop()
  var requires = fileNames.map(function(name) {
    if (COVERAGE_DIR) {
      name = name.replace(SRC_DIR, COVERAGE_DIR);
    }
    return "\trequire('./" + name  + "');\n"
  }).join('');
  writeOutput(start + requires + end);
});