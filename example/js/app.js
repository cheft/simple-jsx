/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var el = __webpack_require__(2);
	var diff = __webpack_require__(4);
	var patch = __webpack_require__(5);
	var test1 = __webpack_require__(7);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	
	// if (typeof window == 'undefined') {
	//   var jsdom = require("jsdom").jsdom;
	//   var window = jsdom.defaultView;
	//   document = jsdom('');
	// }
	/**
	 * Virtual-dom Element.
	 * @param {String} tagName
	 * @param {Object} props - Element's properties,
	 *                       - using object to store key-value pair
	 * @param {Array<Element|String>} - This element's children elements.
	 *                                - Can be Element instance or just a piece plain text.
	 */
	function Element (tagName, props, children) {
	  if (!(this instanceof Element)) {
	    return new Element(tagName, props, children)
	  }
	
	  if (_.isArray(props)) {
	    children = props
	    props = {}
	  }
	
	  this.tagName = tagName
	  this.props = props || {}
	  this.children = children || []
	  this.key = props
	    ? props.key
	    : void 666
	
	  var count = 0
	
	  _.each(this.children, function (child, i) {
	    if (child instanceof Element) {
	      count += child.count
	    } else {
	      children[i] = '' + child
	    }
	    count++
	  })
	
	  this.count = count
	}
	
	/**
	 * Render the hold element tree.
	 */
	Element.prototype.render = function () {
	  var el = document.createElement(this.tagName)
	  var props = this.props
	
	  for (var propName in props) {
	    var propValue = props[propName]
	    el.setAttribute(propName, propValue)
	  }
	
	  var children = this.children || []
	
	  _.each(children, function (child) {
	    var childEl = (child instanceof Element)
	      ? child.render()
	      : document.createTextNode(child)
	    el.appendChild(childEl)
	  })
	
	  return el
	}
	
	module.exports = Element

/***/ },
/* 3 */
/***/ function(module, exports) {

	var _ = exports
	
	_.type = function (obj) {
	  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
	}
	
	_.isArray = function isArray (list) {
	  return _.type(list) === 'Array'
	}
	
	_.isString = function isString (list) {
	  return _.type(list) === 'String'
	}
	
	_.each = function each (array, fn) {
	  for (var i = 0, len = array.length; i < len; i++) {
	    fn(array[i], i)
	  }
	}
	
	_.toArray = function toArray (listLike) {
	  if (!listLike) {
	    return []
	  }
	
	  var list = []
	
	  for (var i = 0, len = listLike.length; i < len; i++) {
	    list.push(listLike[i])
	  }
	
	  return list
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var patch = __webpack_require__(5)
	var listDiff = __webpack_require__(6).diff
	
	function diff (oldTree, newTree) {
	  var index = 0
	  var patches = {}
	  dfsWalk(oldTree, newTree, index, patches)
	  return patches
	}
	
	function dfsWalk (oldNode, newNode, index, patches) {
	  var currentPatch = []
	
	  // node is removed
	  if (newNode === null) {
	    // will be removed when perform reordering, so has no needs to do anthings in here
	  // textNode content replacing
	  } else if (_.isString(oldNode) && _.isString(newNode)) {
	    if (newNode !== oldNode) {
	      currentPatch.push({ type: patch.TEXT, content: newNode })
	    }
	  // nodes are the same, diff its props and children
	  } else if (
	      oldNode.tagName === newNode.tagName &&
	      oldNode.key === newNode.key
	    ) {
	    // diff props
	    var propsPatches = diffProps(oldNode, newNode)
	    if (propsPatches) {
	      currentPatch.push({ type: patch.PROPS, props: propsPatches })
	    }
	    // diff children
	    diffChildren(oldNode.children, newNode.children, index, patches, currentPatch)
	  // nodes are not the same, replace the old node with new node
	  } else {
	    currentPatch.push({ type: patch.REPLACE, node: newNode })
	  }
	
	  if (currentPatch.length) {
	    patches[index] = currentPatch
	  }
	}
	
	function diffChildren (oldChildren, newChildren, index, patches, currentPatch) {
	  var diffs = listDiff(oldChildren, newChildren, 'key')
	  newChildren = diffs.children
	
	  if (diffs.moves.length) {
	    var reorderPatch = { type: patch.REORDER, moves: diffs.moves }
	    currentPatch.push(reorderPatch)
	  }
	
	  var leftNode = null
	  var currentNodeIndex = index
	  _.each(oldChildren, function (child, i) {
	    var newChild = newChildren[i]
	    currentNodeIndex = (leftNode && leftNode.count)
	      ? currentNodeIndex + leftNode.count + 1
	      : currentNodeIndex + 1
	    dfsWalk(child, newChild, currentNodeIndex, patches)
	    leftNode = child
	  })
	}
	
	function diffProps (oldNode, newNode) {
	  var count = 0
	  var oldProps = oldNode.props
	  var newProps = newNode.props
	
	  var key, value
	  var propsPatches = {}
	
	  // find out different properties
	  for (key in oldProps) {
	    value = oldProps[key]
	    if (newProps[key] !== value) {
	      count++
	      propsPatches[key] = newProps[key]
	    }
	  }
	
	  // find out new property
	  for (key in newProps) {
	    value = newProps[key]
	    if (!oldProps.hasOwnProperty(key)) {
	      count++
	      propsPatches[key] = newProps[key]
	    }
	  }
	
	  // if properties all are identical
	  if (count === 0) {
	    return null
	  }
	
	  return propsPatches
	}
	
	module.exports = diff

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	
	var REPLACE = 0
	var REORDER = 1
	var PROPS = 2
	var TEXT = 3
	
	function patch (node, patches) {
	  var walker = {index: 0}
	  dfsWalk(node, walker, patches)
	}
	
	function dfsWalk (node, walker, patches) {
	  var currentPatches = patches[walker.index]
	
	  var len = node.childNodes
	    ? node.childNodes.length
	    : 0
	  for (var i = 0; i < len; i++) {
	    var child = node.childNodes[i]
	    walker.index++
	    dfsWalk(child, walker, patches)
	  }
	
	  if (currentPatches) {
	    applyPatches(node, currentPatches)
	  }
	}
	
	function applyPatches (node, currentPatches) {
	  _.each(currentPatches, function (currentPatch) {
	    switch (currentPatch.type) {
	      case REPLACE:
	        node.parentNode.replaceChild(currentPatch.node.render(), node)
	        break
	      case REORDER:
	        reorderChildren(node, currentPatch.moves)
	        break
	      case PROPS:
	        setProps(node, currentPatch.props)
	        break
	      case TEXT:
	        if (node.textContent) {
	          node.textContent = currentPatch.content
	        } else {
	          // fuck ie
	          node.nodeValue = currentPatch.content
	        }
	        break
	      default:
	        throw new Error('Unknown patch type ' + currentPatch.type)
	    }
	  })
	}
	
	function setProps (node, props) {
	  for (var key in props) {
	    if (props[key] === void 666) {
	      node.removeAttribute(key)
	    } else {
	      // for setting IE' style attr as string is not working!
	      if (key === 'style') {
	        node.style.cssText = props[key]
	      } else {
	        node.setAttribute(key, props[key])
	      }
	    }
	  }
	}
	
	function reorderChildren (node, moves) {
	  var staticNodeList = _.toArray(node.childNodes)
	  var maps = {}
	
	  _.each(staticNodeList, function (node) {
	    if (node.nodeType === 1) {
	      var key = node.getAttribute('key')
	      if (key) {
	        maps[key] = node
	      }
	    }
	  })
	
	  _.each(moves, function (move) {
	    var index = move.index
	    if (move.type === 0) { // remove item
	      if (staticNodeList[index] === node.childNodes[index]) { // maybe have been removed for inserting
	        node.removeChild(node.childNodes[index])
	      }
	      staticNodeList.splice(index, 1)
	    } else if (move.type === 1) { // insert item
	      var insertNode = maps[move.item.key]
	        ? maps[move.item.key] // reuse old item
	        : move.item.render()
	      staticNodeList.splice(index, 0, insertNode)
	      node.insertBefore(insertNode, node.childNodes[index] || null)
	    }
	  })
	}
	
	patch.REPLACE = REPLACE
	patch.REORDER = REORDER
	patch.PROPS = PROPS
	patch.TEXT = TEXT
	
	module.exports = patch

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Diff two list in O(N).
	 * @param {Array} oldList - Original List
	 * @param {Array} newList - List After certain insertions, removes, or moves
	 * @return {Object} - {moves: <Array>}
	 *                  - moves is a list of actions that telling how to remove and insert
	 */
	function diff (oldList, newList, key) {
	  var oldMap = makeKeyIndexAndFree(oldList, key)
	  var newMap = makeKeyIndexAndFree(newList, key)
	
	  var newFree = newMap.free
	
	  var oldKeyIndex = oldMap.keyIndex
	  var newKeyIndex = newMap.keyIndex
	
	  var moves = []
	
	  // a simulate list to manipulate
	  var children = []
	  var i = 0
	  var item
	  var itemKey
	  var freeIndex = 0
	
	  // fist pass to check item in old list: if it's removed or not
	  while (i < oldList.length) {
	    item = oldList[i]
	    itemKey = getItemKey(item, key)
	    if (itemKey) {
	      if (!newKeyIndex.hasOwnProperty(itemKey)) {
	        children.push(null)
	      } else {
	        var newItemIndex = newKeyIndex[itemKey]
	        children.push(newList[newItemIndex])
	      }
	    } else {
	      var freeItem = newFree[freeIndex++]
	      children.push(freeItem || null)
	    }
	    i++
	  }
	
	  var simulateList = children.slice(0)
	
	  // remove items no longer exist
	  i = 0
	  while (i < simulateList.length) {
	    if (simulateList[i] === null) {
	      remove(i)
	      removeSimulate(i)
	    } else {
	      i++
	    }
	  }
	
	  // i is cursor pointing to a item in new list
	  // j is cursor pointing to a item in simulateList
	  var j = i = 0
	  while (i < newList.length) {
	    item = newList[i]
	    itemKey = getItemKey(item, key)
	
	    var simulateItem = simulateList[j]
	    var simulateItemKey = getItemKey(simulateItem, key)
	
	    if (simulateItem) {
	      if (itemKey === simulateItemKey) {
	        j++
	      } else {
	        // new item, just inesrt it
	        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
	          insert(i, item)
	        } else {
	          // if remove current simulateItem make item in right place
	          // then just remove it
	          var nextItemKey = getItemKey(simulateList[j + 1], key)
	          if (nextItemKey === itemKey) {
	            remove(i)
	            removeSimulate(j)
	            j++ // after removing, current j is right, just jump to next one
	          } else {
	            // else insert item
	            insert(i, item)
	          }
	        }
	      }
	    } else {
	      insert(i, item)
	    }
	
	    i++
	  }
	
	  function remove (index) {
	    var move = {index: index, type: 0}
	    moves.push(move)
	  }
	
	  function insert (index, item) {
	    var move = {index: index, item: item, type: 1}
	    moves.push(move)
	  }
	
	  function removeSimulate (index) {
	    simulateList.splice(index, 1)
	  }
	
	  return {
	    moves: moves,
	    children: children
	  }
	}
	
	/**
	 * Convert list to key-item keyIndex object.
	 * @param {Array} list
	 * @param {String|Function} key
	 */
	function makeKeyIndexAndFree (list, key) {
	  var keyIndex = {}
	  var free = []
	  for (var i = 0, len = list.length; i < len; i++) {
	    var item = list[i]
	    var itemKey = getItemKey(item, key)
	    if (itemKey) {
	      keyIndex[itemKey] = i
	    } else {
	      free.push(item)
	    }
	  }
	  return {
	    keyIndex: keyIndex,
	    free: free
	  }
	}
	
	function getItemKey (item, key) {
	  if (!item || !key) return void 666
	  return typeof key === 'string'
	    ? item[key]
	    : key(item)
	}
	
	exports.makeKeyIndexAndFree = makeKeyIndexAndFree // exports for test
	exports.diff = diff


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function(data) {
	  return el('test1', {}, [
	    el('h1', {"id":"h1","class":"h1"}, ['Hello World']),
	    el('table', {"style":"text-align: center;"}, [
	      el('tbody', {}, data.list.map(function(item) {
	          return el('tr', {}, [
	            el('td', {}, ['111']),
	            el('td', {}, ['222'])
	          ]);
	        })
	      )
	    ])
	  ]);
	};


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map