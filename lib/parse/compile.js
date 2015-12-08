var fs = require('fs');
var parse = require('./html').parse;

var HEAD = 'module.exports = function(data) {\n';
var TAIL = '\n};\n';
var TAB = '  ';

var outFile = function(tree, outPath) {
  var content = '';
  content += TAB + 'return el(\'' + tree[0].name + '\', ' + (tree[0].attributes ? JSON.stringify(tree[0].attributes) : '{}') + ', [';
  content = recurse(tree[0].children, content, TAB);
  content += '\n' + TAB + ']);'
  fs.writeFileSync(outPath, HEAD + content + TAIL);
}

var compile = function(inPath, outPath) {
  var tpl = fs.readFileSync(inPath).toString();
  var tree = parse(tpl);
  outFile(tree, outPath);
};

var recurse = function(children, content, indent) {
  if (children && children.length > 0) {
    indent += TAB;
    var tmp = {};
    for (var i = 0; i < children.length; i++) {
      var o = children[i];
      if (o.type == 'tag') {
        content = indentTag(o, content, indent);
      } else if(o.type == 'text') {
        content += '\'' + o.value + '\'';
      }
    };
  }
  return content;
}

indentTag = function(o, content, indent) {
  if (o.attributes) {
    delete o.attributes._type;
    if (o.attributes.each) {
      var _key = o.attributes.each;
      delete o.attributes.each;
      // TODO 多一个[], 最后一个多 ,
      content += '\n' + indent + 'data.' + _key + '.map(function(item) {' +
        '\n' + TAB + indent + 'return el(\'' + o.name + '\', ' + JSON.stringify(o.attributes) + ', [';
      content = indentChildren(o, content, indent + TAB);
      content += '\n' + TAB + indent + ']);' + '\n' + indent + '})'
    }else {
      content += '\n' + indent + 'el(\'' + o.name + '\', ' + JSON.stringify(o.attributes) + ', [';
      content = indentChildren(o, content, indent);
      content += '\n'  + indent + ']),'
    }
   }else {
    content += '\n' + indent + 'el(\'' + o.name + '\', ' + '{}' + ', [';
    content = indentChildren(o, content, indent);
    content += '\n'  + indent + ']),'
  }
  return content;
}

indentChildren = function(o, content, indent) {
  if (o.children) {
    content = recurse(o.children, content, indent);
  }
  return content;
}

compile('../../example/tag/test1.html', '../../example/tag/test1.js');