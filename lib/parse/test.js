var str = '<table id="mytable" aaa="sdf sf" readonly  test="sfff">234234' +
'23423<tr each=list><td name="name">name name</td></tr>234234</table>';
var parse = require('./html').parse;
var el = require('../vdom/element');
var diff = require('../vdom/diff').diff;
var patch = require('../vdom/patch').patch;

var table = {};
var convertSVD = function(root, node, opts) {
  console.log(opts);
  if (opts && opts.length > 0) {
    var tmp = {};
    for (var i = 0; i < opts.length; i++) {
      var o = opts[i];
      if (o.type == 'tag') {
        if (o.attributes) {
          delete o.attributes._type;
          tmp = el(o.name, o.attributes);
          if (o.attributes.name) {
            table[o.attributes.name] = tmp;
          }
          if (o.attributes.id) {
            table[o.attributes.id] = tmp;
          }
        }else {
          tmp = el(o.name);
        }
        node.children.push(tmp);
        convertSVD(root, tmp, o.children);
      } else if(o.type == 'text') {
        node.children.push(o.value);
      }
    };
  }
}

var node = el('div');
convertSVD(node, node, parse(str));
console.log(node.render().innerHTML);
console.log(table.name.render().innerHTML);
