var fs = require('fs');
var parse = require('./html').parse;

var HEAD = 'module.exports = function(data) {\n';
var TAIL = '\n};\n';
var TAB = '  ';

var outFile = function(tree, outPath) {
  var content = '';
  content += TAB + 'el(\'' + tree[0].name + '\', ' + JSON.stringify(tree[0].attributes);
  content = recurse(tree[0].children, content, TAB + TAB);
  content += ');'
  fs.writeFileSync(outPath, HEAD + content + TAIL);
}

var compile = function(inPath, outPath) {
  var tpl = fs.readFileSync(inPath).toString();
  var tree = parse(tpl);
  outFile(tree, outPath);
};

var recurse = function(children, content, indent) {
  if (children && children.length > 0) {
    var tmp = {};
    for (var i = 0; i < children.length; i++) {
      var o = children[i];
      if (o.type == 'tag') {
        if (o.attributes) {
          delete o.attributes._type;
          content += indent + 'el(\'' + o.name + '\', ' + JSON.stringify(o.attributes) ;
        }else {
          content += indent + 'el(\'' + o.name + '\'';
        }
        if (o.children) {
          indent = TAB + indent;
          recurse(o.children, content, indent);
        }
        content += indent + ');'
      } else if(o.type == 'text') {
        content += indent + 'el(\'' + o.name + '\', ' + JSON.stringify(o.attributes) + ', ' + o.value + ');';
      }
    };
  }
  return content;
}

compile('../../example/tag/test1.html', '../../example/tag/test1.js');