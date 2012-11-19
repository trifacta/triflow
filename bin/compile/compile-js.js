require('./compile')

snockets.getConcatenation(requireTreeFile, flags, function(err, js) {
  writeOutput(start + js + '\n' + end);
});