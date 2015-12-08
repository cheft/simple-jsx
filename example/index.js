var el = require('../lib/vdom/element');
var diff = require('../lib/vdom/diff');
var patch = require('../lib/vdom/patch');
var test1 = require('./tag/test1');
window.el = el;

window.test = function test() {
  // console.log('click');
  data.list = data.list.reverse();
  var x = new Date().getTime();
  var newTree = test1(data);
  var patches = diff(tree, newTree);
  patch(root, patches)
  tree = newTree;
  document.getElementById('time').innerHTML = '- Reversing took ' + (new Date().getTime() - x) + ' ms';
  // setTimeout(test, 10);
}


var data = {list: []};
for (var i = 0; i < 10; i++) {
  data.list.push(i);
}

var tree = test1(data);

var root = tree.render()

window.onload = function() {
  document.body.appendChild(root);
}
